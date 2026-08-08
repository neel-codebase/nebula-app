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
    title: '🌌 Nebula Architecture',
    content: 'Cloud-synced infinite spatial canvas engineered for high-leveraged thought management. Includes #pwa and #vite.',
    x: 0,
    y: 0,
    width: 320,
    height: 200,
    color: 'cyan',
    tags: ['Architecture', 'PWA', 'Vite'],
    pinned: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'node-2': {
    id: 'node-2',
    title: '🎨 HTML5 Canvas Engine',
    content: '60FPS rendering pipeline featuring high-DPI scaling, elastic bezier tethers, & particle impulse streams. Built for #pwa.',
    x: 450,
    y: -120,
    width: 300,
    height: 190,
    color: 'purple',
    tags: ['Canvas', 'Physics', 'PWA'],
    pinned: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'node-3': {
    id: 'node-3',
    title: '🔥 Live Firestore Sync',
    content: 'Optimistic local updates with debounced cloud persistence and multi-device realtime syncing with #firebase.',
    x: 450,
    y: 150,
    width: 300,
    height: 190,
    color: 'emerald',
    tags: ['Firebase', 'Firestore', 'Realtime'],
    pinned: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'node-4': {
    id: 'node-4',
    title: '⚡ Progressive Web App',
    content: 'Offline-first service worker precaching, native install prompt, and zero-latency responsiveness for #pwa.',
    x: -420,
    y: 50,
    width: 300,
    height: 180,
    color: 'amber',
    tags: ['Offline', 'Manifest', 'PWA'],
    pinned: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
};

const INITIAL_LINKS = [
  { id: 'link-1', sourceId: 'node-1', targetId: 'node-2', label: 'Renders via', color: 'purple' },
  { id: 'link-2', sourceId: 'node-1', targetId: 'node-3', label: 'Persists to', color: 'emerald' },
  { id: 'link-3', sourceId: 'node-4', targetId: 'node-1', label: 'Powers', color: 'amber' }
];

export const SpaceProvider = ({ children }) => {
  // Auth User State
  const [currentUser, setCurrentUser] = useState(null);

  // Spatial Data State
  const [nodes, setNodes] = useState(() => {
    const saved = localStorage.getItem('nebula_nodes');
    return saved ? JSON.parse(saved) : INITIAL_NODES;
  });

  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem('nebula_links');
    return saved ? JSON.parse(saved) : INITIAL_LINKS;
  });

  // Camera Matrix & Viewport State
  const [camera, setCamera] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2, zoom: 1.0 });
  const [selection, setSelection] = useState({ nodeIds: [], linkId: null });
  const [activeTool, setActiveTool] = useState('select');
  const [tetherDraft, setTetherDraft] = useState(null);
  
  // UI & Modal States
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [searchQuery, setSearchQuery] = useState('');
  const [pwaPrompt, setPwaPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);

  const pendingSyncRef = useRef({});

  // Auth Listener
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Compute Organic Auto #Tag Tethers
  const autoTagTethers = useMemo(() => {
    return computeTagTethers(nodes);
  }, [nodes]);

  // Combine manual links with auto tag tethers
  const allCombinedLinks = useMemo(() => {
    return [...links, ...autoTagTethers];
  }, [links, autoTagTethers]);

  // LocalStorage Cache
  useEffect(() => {
    try {
      localStorage.setItem('nebula_nodes', JSON.stringify(nodes));
      localStorage.setItem('nebula_links', JSON.stringify(links));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [nodes, links]);

  // PWA Prompt Listener
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

  // Realtime Firestore Sync
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
          const cloudNodes = {};
          snapshot.docs.forEach((doc) => {
            cloudNodes[doc.id] = { id: doc.id, ...doc.data() };
          });
          setNodes((prev) => ({ ...prev, ...cloudNodes }));
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

  // Sync Node to Cloud
  const syncNodeToCloud = useCallback((node, immediate = false) => {
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

  // Sync Link to Cloud
  const syncLinkToCloud = useCallback((link) => {
    if (!db) return;
    setSyncStatus('syncing');
    const linksCollectionName = currentUser ? `users/${currentUser.uid}/nebula_links` : 'nebula_links';
    setDoc(doc(db, linksCollectionName, link.id), link)
      .then(() => setSyncStatus('synced'))
      .catch(() => setSyncStatus('offline'));
  }, [currentUser]);

  // Create Node Action
  const createNode = useCallback((worldX, worldY, title = 'New Thought', color = 'cyan', content = '') => {
    const id = `node-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const parsedTags = extractHashtags(title + ' ' + content);

    const newNode = {
      id,
      title,
      content: content || 'Click double-tap or edit icon to add detailed spatial notes...',
      x: worldX ?? (window.innerWidth / 2 - camera.x) / camera.zoom,
      y: worldY ?? (window.innerHeight / 2 - camera.y) / camera.zoom,
      width: 290,
      height: 180,
      color,
      tags: parsedTags.length > 0 ? parsedTags : ['Idea'],
      pinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setNodes((prev) => ({ ...prev, [id]: newNode }));
    setSelection({ nodeIds: [id], linkId: null });
    syncNodeToCloud(newNode, true);
    ambientAudio.playNodeCreatedSound();
    return id;
  }, [camera, syncNodeToCloud]);

  // Update Node Action
  const updateNode = useCallback((id, updates, immediateSync = false) => {
    setNodes((prev) => {
      const existing = prev[id];
      if (!existing) return prev;
      const updated = { ...existing, ...updates, updatedAt: Date.now() };
      
      // Auto-extract tags if content or title changed
      if (updates.title || updates.content) {
        const text = (updated.title || '') + ' ' + (updated.content || '');
        const autoTags = extractHashtags(text);
        if (autoTags.length > 0) {
          const combined = Array.from(new Set([...(updated.tags || []), ...autoTags]));
          updated.tags = combined;
        }
      }

      syncNodeToCloud(updated, immediateSync);
      return { ...prev, [id]: updated };
    });
  }, [syncNodeToCloud]);

  // Delete Node Action
  const deleteNode = useCallback((id) => {
    setNodes((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setLinks((prev) => prev.filter((l) => l.sourceId !== id && l.targetId !== id));
    setSelection((prev) => ({ ...prev, nodeIds: prev.nodeIds.filter((nid) => nid !== id) }));
    
    if (db) {
      const collectionName = currentUser ? `users/${currentUser.uid}/nebula_thoughts` : 'nebula_thoughts';
      deleteDoc(doc(db, collectionName, id)).catch(console.error);
    }
    ambientAudio.playDeleteSound();
  }, [currentUser]);

  // Create Link Action
  const createLink = useCallback((sourceId, targetId, label = 'relates to', color = 'cyan') => {
    if (sourceId === targetId) return;
    const existing = links.find((l) => (l.sourceId === sourceId && l.targetId === targetId) || (l.sourceId === targetId && l.targetId === sourceId));
    if (existing) return;

    const id = `link-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newLink = { id, sourceId, targetId, label, color };
    setLinks((prev) => [...prev, newLink]);
    syncLinkToCloud(newLink);
    ambientAudio.playTetherSound();
  }, [links, syncLinkToCloud]);

  // Delete Link Action
  const deleteLink = useCallback((linkId) => {
    setLinks((prev) => prev.filter((l) => l.id !== linkId));
    setSelection((prev) => ({ ...prev, linkId: null }));
    if (db) {
      const linksCollectionName = currentUser ? `users/${currentUser.uid}/nebula_links` : 'nebula_links';
      deleteDoc(doc(db, linksCollectionName, linkId)).catch(console.error);
    }
    ambientAudio.playDeleteSound();
  }, [currentUser]);

  // Cluster Orbit Constellations Auto-Layout Algorithm
  const autoLayout = useCallback(() => {
    const nodeKeys = Object.keys(nodes);
    if (nodeKeys.length === 0) return;

    const updated = { ...nodes };
    const radius = Math.max(380, nodeKeys.length * 95);
    const angleStep = (2 * Math.PI) / nodeKeys.length;

    nodeKeys.forEach((key, index) => {
      const angle = index * angleStep;
      // Add subtle orbital spiral offsets
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

  // Reset Camera View
  const resetView = useCallback(() => {
    setCamera({ x: window.innerWidth / 2, y: window.innerHeight / 2, zoom: 1.0 });
  }, []);

  // Fit View
  const fitView = useCallback(() => {
    const nodeArray = Object.values(nodes);
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

  // Audio Toggle Action
  const toggleAmbientAudio = useCallback(() => {
    const active = ambientAudio.toggleAudio();
    setIsAudioActive(active);
  }, []);

  // PWA Install Prompt
  const triggerPwaInstall = useCallback(() => {
    if (pwaPrompt) {
      pwaPrompt.prompt();
      pwaPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') setIsInstalled(true);
        setPwaPrompt(null);
      });
    }
  }, [pwaPrompt]);

  return (
    <SpaceContext.Provider
      value={{
        currentUser,
        signInWithGoogle,
        signOutUser,
        nodes,
        links: allCombinedLinks,
        manualLinks: links,
        camera,
        setCamera,
        selection,
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
        deleteNode,
        createLink,
        deleteLink,
        autoLayout,
        resetView,
        fitView
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
