import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { db, auth, signInWithGoogle, signOutUser, onAuthStateChanged } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { computeTagTethers, extractHashtags } from '../utils/tagParser';
import { ambientAudio } from '../utils/ambientAudio';

const SpaceContext = createContext(null);

const INITIAL_NODES = {
  'node-1': {
    id: 'node-1',
    title: '🌌 Welcome to Nebula v3.0',
    content: 'Cloud-synced infinite spatial workspace for strategic thought mapping.\n\n- [x] Drag cards around the canvas\n- [ ] Add #tags like #canvas to auto-tether notes\n- [ ] Drag (+) handles to draw custom tethers',
    x: -240,
    y: -20,
    width: 330,
    height: 220,
    color: 'cyan',
    tags: ['welcome', 'canvas'],
    pinned: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'node-2': {
    id: 'node-2',
    title: '🔗 Tethering System',
    content: 'Drag from any **(+) anchor handle** on a card edge to draw glowing connection tethers.\n\n- Double-click tethers to rename\n- Click tethers to choose accent colors',
    x: 220,
    y: -130,
    width: 310,
    height: 210,
    color: 'purple',
    tags: ['tether', 'canvas'],
    pinned: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'node-3': {
    id: 'node-3',
    title: '🏷️ Organic #Tags',
    content: 'Add matching hashtags like #canvas to automatically generate glowing dotted tethers across space.',
    x: 220,
    y: 130,
    width: 310,
    height: 180,
    color: 'emerald',
    tags: ['tags', 'canvas'],
    pinned: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
};

const INITIAL_LINKS = [
  { id: 'link-1', sourceId: 'node-1', targetId: 'node-2', label: 'connects to', color: 'purple' },
  { id: 'link-2', sourceId: 'node-1', targetId: 'node-3', label: 'shares #canvas', color: 'emerald' }
];

const getSafeInitialNodes = () => {
  try {
    const saved = localStorage.getItem('nebula_nodes');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('LocalStorage nodes parse error, using fallback:', e);
  }
  return INITIAL_NODES;
};

const getSafeInitialLinks = () => {
  try {
    const saved = localStorage.getItem('nebula_links');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('LocalStorage links parse error, using fallback:', e);
  }
  return INITIAL_LINKS;
};

export const SpaceProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [nodes, setNodes] = useState(getSafeInitialNodes);
  const [links, setLinks] = useState(getSafeInitialLinks);

  const [camera, setCamera] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2, zoom: 0.95 });
  const [selection, setSelection] = useState({ nodeIds: [], linkId: null });
  const [activeTool, setActiveTool] = useState('select');
  const [tetherDraft, setTetherDraft] = useState(null);
  
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [searchQuery, setSearchQuery] = useState('');
  const [pwaPrompt, setPwaPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);

  const pendingSyncRef = useRef({});
  const lastLocalEditTimeRef = useRef({});

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const autoTagTethers = useMemo(() => {
    return computeTagTethers(nodes || {});
  }, [nodes]);

  const allCombinedLinks = useMemo(() => {
    return [...(links || []), ...(autoTagTethers || [])];
  }, [links, autoTagTethers]);

  useEffect(() => {
    try {
      if (nodes && typeof nodes === 'object') {
        localStorage.setItem('nebula_nodes', JSON.stringify(nodes));
      }
      if (links && Array.isArray(links)) {
        localStorage.setItem('nebula_links', JSON.stringify(links));
      }
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [nodes, links]);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setPwaPrompt(e);
    };
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setPwaPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Firestore Sync with local-edit protection
  useEffect(() => {
    if (!db) {
      setSyncStatus('offline');
      return;
    }

    setSyncStatus('syncing');
    const collectionName = currentUser ? `users/${currentUser.uid}/nebula_thoughts` : 'nebula_thoughts';
    const linksCollectionName = currentUser ? `users/${currentUser.uid}/nebula_links` : 'nebula_links';

    const unsubscribeThoughts = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        if (!snapshot.empty) {
          const now = Date.now();
          const cloudNodes = {};
          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            const lastLocal = lastLocalEditTimeRef.current[doc.id] || 0;
            // Ignore cloud snapshot if edited locally within last 1.5s unless cloud doc is strictly newer
            if (now - lastLocal > 1500 || (data.updatedAt && data.updatedAt >= lastLocal)) {
              cloudNodes[doc.id] = {
                id: doc.id,
                width: 300,
                height: 200,
                ...data
              };
            }
          });
          if (Object.keys(cloudNodes).length > 0) {
            setNodes((prev) => ({ ...(prev || {}), ...cloudNodes }));
          }
        } else if (!currentUser) {
          Object.values(INITIAL_NODES).forEach((node) => {
            setDoc(doc(db, 'nebula_thoughts', node.id), node).catch(console.error);
          });
        }
        setSyncStatus('synced');
      },
      (error) => {
        console.warn('Firestore subscription warning:', error);
        setSyncStatus('offline');
      }
    );

    const unsubscribeLinks = onSnapshot(
      collection(db, linksCollectionName),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudLinks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setLinks(cloudLinks);
        } else if (!currentUser) {
          INITIAL_LINKS.forEach((link) => {
            setDoc(doc(db, 'nebula_links', link.id), link).catch(console.error);
          });
        }
      },
      (error) => console.warn('Firestore links warning:', error)
    );

    return () => {
      unsubscribeThoughts();
      unsubscribeLinks();
    };
  }, [currentUser]);

  const syncNodeToCloud = useCallback((node, immediate = false) => {
    if (!node) return;
    lastLocalEditTimeRef.current[node.id] = Date.now();
    if (!db) return;
    setSyncStatus('syncing');
    const collectionName = currentUser ? `users/${currentUser.uid}/nebula_thoughts` : 'nebula_thoughts';

    const updateDoc = () => {
      setDoc(doc(db, collectionName, node.id), {
        ...node,
        updatedAt: Date.now()
      }, { merge: true })
        .then(() => setSyncStatus('synced'))
        .catch(() => setSyncStatus('offline'));
    };

    if (immediate) {
      if (pendingSyncRef.current[node.id]) clearTimeout(pendingSyncRef.current[node.id]);
      updateDoc();
    } else {
      if (pendingSyncRef.current[node.id]) clearTimeout(pendingSyncRef.current[node.id]);
      pendingSyncRef.current[node.id] = setTimeout(updateDoc, 300);
    }
  }, [currentUser]);

  const syncLinkToCloud = useCallback((link) => {
    if (!db || !link) return;
    setSyncStatus('syncing');
    const linksCollectionName = currentUser ? `users/${currentUser.uid}/nebula_links` : 'nebula_links';
    setDoc(doc(db, linksCollectionName, link.id), link)
      .then(() => setSyncStatus('synced'))
      .catch(() => setSyncStatus('offline'));
  }, [currentUser]);

  const createNode = useCallback((worldX, worldY, title = 'New Thought', color = 'cyan', content = '') => {
    const id = `node-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const parsedTags = extractHashtags(title + ' ' + content);

    const newNode = {
      id,
      title,
      content: content || 'Click double-tap or edit icon to add detailed spatial notes...',
      x: worldX ?? (window.innerWidth / 2 - camera.x) / camera.zoom,
      y: worldY ?? (window.innerHeight / 2 - camera.y) / camera.zoom,
      width: 300,
      height: 200,
      color,
      tags: parsedTags,
      pinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    lastLocalEditTimeRef.current[id] = Date.now();
    setNodes((prev) => ({ ...(prev || {}), [id]: newNode }));
    setSelection({ nodeIds: [id], linkId: null });
    syncNodeToCloud(newNode, true);
    ambientAudio.playNodeCreatedSound();
    return id;
  }, [camera, syncNodeToCloud]);

  const updateNode = useCallback((id, updates, immediateSync = false) => {
    lastLocalEditTimeRef.current[id] = Date.now();
    setNodes((prev) => {
      const current = prev || {};
      const existing = current[id];
      if (!existing) return current;
      const updated = { ...existing, ...updates, updatedAt: Date.now() };
      
      if (updates.title !== undefined || updates.content !== undefined) {
        const text = (updated.title || '') + ' ' + (updated.content || '');
        const autoTags = extractHashtags(text);
        if (autoTags.length > 0) {
          const combined = Array.from(new Set([...(updated.tags || []), ...autoTags]));
          updated.tags = combined;
        }
      }

      syncNodeToCloud(updated, immediateSync);
      return { ...current, [id]: updated };
    });
  }, [syncNodeToCloud]);

  const moveNodes = useCallback((nodeIds = [], deltaX = 0, deltaY = 0) => {
    const now = Date.now();
    setNodes((prev) => {
      const next = { ...(prev || {}) };
      nodeIds.forEach((id) => {
        if (next[id]) {
          lastLocalEditTimeRef.current[id] = now;
          const updated = {
            ...next[id],
            x: next[id].x + deltaX,
            y: next[id].y + deltaY,
            updatedAt: now
          };
          next[id] = updated;
          syncNodeToCloud(updated, false);
        }
      });
      return next;
    });
  }, [syncNodeToCloud]);

  const deleteNode = useCallback((id) => {
    setNodes((prev) => {
      const next = { ...(prev || {}) };
      delete next[id];
      return next;
    });
    setLinks((prev) => (prev || []).filter((l) => l.sourceId !== id && l.targetId !== id));
    setSelection((prev) => ({ ...prev, nodeIds: (prev.nodeIds || []).filter((nid) => nid !== id) }));
    
    if (db) {
      const collectionName = currentUser ? `users/${currentUser.uid}/nebula_thoughts` : 'nebula_thoughts';
      deleteDoc(doc(db, collectionName, id)).catch(console.error);
    }
    ambientAudio.playDeleteSound();
  }, [currentUser]);

  const createLink = useCallback((sourceId, targetId, label = 'connects to', color = 'cyan') => {
    if (sourceId === targetId) return;
    const currentLinks = links || [];
    const existing = currentLinks.find((l) => (l.sourceId === sourceId && l.targetId === targetId) || (l.sourceId === targetId && l.targetId === sourceId));
    if (existing) return;

    const id = `link-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newLink = { id, sourceId, targetId, label, color };
    setLinks((prev) => [...(prev || []), newLink]);
    syncLinkToCloud(newLink);
    ambientAudio.playTetherSound();
  }, [links, syncLinkToCloud]);

  const updateLink = useCallback((linkId, updates) => {
    setLinks((prev) => {
      return (prev || []).map((l) => {
        if (l.id === linkId) {
          const updated = { ...l, ...updates };
          syncLinkToCloud(updated);
          return updated;
        }
        return l;
      });
    });
  }, [syncLinkToCloud]);

  const deleteLink = useCallback((linkId) => {
    setLinks((prev) => (prev || []).filter((l) => l.id !== linkId));
    setSelection((prev) => ({ ...prev, linkId: null }));
    if (db) {
      const linksCollectionName = currentUser ? `users/${currentUser.uid}/nebula_links` : 'nebula_links';
      deleteDoc(doc(db, linksCollectionName, linkId)).catch(console.error);
    }
    ambientAudio.playDeleteSound();
  }, [currentUser]);

  const autoLayout = useCallback(() => {
    const currentNodes = nodes || {};
    const allNodeKeys = Object.keys(currentNodes);
    const unpinnedKeys = allNodeKeys.filter((k) => !currentNodes[k]?.pinned);

    if (unpinnedKeys.length === 0) return;

    const updated = { ...currentNodes };
    const radius = Math.max(380, unpinnedKeys.length * 95);
    const angleStep = (2 * Math.PI) / unpinnedKeys.length;

    unpinnedKeys.forEach((key, index) => {
      const angle = index * angleStep;
      const orbitOffset = (index % 2 === 0 ? 1 : 0.85);
      updated[key] = {
        ...updated[key],
        x: Math.cos(angle) * radius * orbitOffset,
        y: Math.sin(angle) * radius * orbitOffset,
        updatedAt: Date.now()
      };
      syncNodeToCloud(updated[key], true);
    });

    setNodes(updated);
    setCamera({ x: window.innerWidth / 2, y: window.innerHeight / 2, zoom: 0.85 });
    ambientAudio.playTetherSound();
  }, [nodes, syncNodeToCloud]);

  const resetView = useCallback(() => {
    setCamera({ x: window.innerWidth / 2, y: window.innerHeight / 2, zoom: 0.95 });
  }, []);

  const fitView = useCallback(() => {
    const nodeArray = Object.values(nodes || {});
    if (nodeArray.length === 0) return resetView();

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodeArray.forEach((n) => {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + n.width);
      maxY = Math.max(maxY, n.y + n.height);
    });

    const padding = 150;
    const boundsWidth = (maxX - minX) + padding * 2;
    const boundsHeight = (maxY - minY) + padding * 2;
    
    const zoomX = window.innerWidth / boundsWidth;
    const zoomY = window.innerHeight / boundsHeight;
    const newZoom = Math.min(Math.max(Math.min(zoomX, zoomY), 0.2), 2.0);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setCamera({
      x: window.innerWidth / 2 - centerX * newZoom,
      y: window.innerHeight / 2 - centerY * newZoom,
      zoom: newZoom
    });
  }, [nodes, resetView]);

  const toggleAmbientAudio = useCallback(() => {
    const active = ambientAudio.toggleAudio();
    setIsAudioActive(active);
  }, []);

  const triggerPwaInstall = useCallback(() => {
    if (pwaPrompt) {
      pwaPrompt.prompt();
      pwaPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') setIsInstalled(true);
        setPwaPrompt(null);
      });
    }
  }, [pwaPrompt]);

  const resetWorkspaceState = useCallback(() => {
    try {
      localStorage.removeItem('nebula_nodes');
      localStorage.removeItem('nebula_links');
    } catch (e) {}
    setNodes(INITIAL_NODES);
    setLinks(INITIAL_LINKS);
    setCamera({ x: window.innerWidth / 2, y: window.innerHeight / 2, zoom: 0.95 });
  }, []);

  return (
    <SpaceContext.Provider
      value={{
        currentUser,
        signInWithGoogle,
        signOutUser,
        nodes: nodes || {},
        links: allCombinedLinks,
        manualLinks: links || [],
        camera,
        setCamera,
        selection: selection || { nodeIds: [], linkId: null },
        setSelection,
        activeTool,
        setActiveTool,
        tetherDraft,
        setTetherDraft,
        editingNodeId,
        setEditingNodeId,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isSidebarOpen,
        setIsSidebarOpen,
        syncStatus,
        searchQuery,
        setSearchQuery,
        pwaPrompt,
        isInstalled,
        isAudioActive,
        toggleAmbientAudio,
        triggerPwaInstall,
        createNode,
        updateNode,
        moveNodes,
        deleteNode,
        createLink,
        updateLink,
        deleteLink,
        autoLayout,
        resetView,
        fitView,
        resetWorkspaceState
      }}
    >
      {children}
    </SpaceContext.Provider>
  );
};

export const useSpace = () => {
  const context = useContext(SpaceContext);
  if (!context) {
    throw new Error('useSpace must be used within a SpaceProvider');
  }
  return context;
};
