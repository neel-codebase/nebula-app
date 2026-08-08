/**
 * Extracts hashtags from title and content string.
 * Example: "Building a #pwa with #vite" -> ["pwa", "vite"]
 */
export const extractHashtags = (text = '') => {
  if (!text) return [];
  const regex = /#([a-zA-Z0-9_\-\u00C0-\u024F]+)/g;
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    const tag = match[1].toLowerCase();
    if (!matches.includes(tag)) {
      matches.push(tag);
    }
  }
  return matches;
};

/**
 * Computes automatic tethers between thoughts that share matching hashtags or explicit tags.
 */
export const computeTagTethers = (nodesMap = {}) => {
  const nodes = Object.values(nodesMap);
  const tagTethers = [];
  const tagToNodes = {};

  // Map each tag to node IDs that possess it
  nodes.forEach((node) => {
    const titleTags = extractHashtags(node.title);
    const contentTags = extractHashtags(node.content);
    const combinedTags = Array.from(
      new Set([...(node.tags || []).map((t) => t.toLowerCase()), ...titleTags, ...contentTags])
    );

    combinedTags.forEach((tag) => {
      if (!tagToNodes[tag]) tagToNodes[tag] = [];
      tagToNodes[tag].push(node.id);
    });
  });

  // Generate tethers for shared tags
  const processedPairs = new Set();

  Object.entries(tagToNodes).forEach(([tag, nodeIds]) => {
    if (nodeIds.length > 1) {
      for (let i = 0; i < nodeIds.length; i++) {
        for (let j = i + 1; j < nodeIds.length; j++) {
          const idA = nodeIds[i];
          const idB = nodeIds[j];
          const pairKey = [idA, idB].sort().join('::') + `::${tag}`;

          if (!processedPairs.has(pairKey)) {
            processedPairs.add(pairKey);
            tagTethers.push({
              id: `tag-tether-${pairKey}`,
              sourceId: idA,
              targetId: idB,
              label: `#${tag}`,
              isAutoTag: true,
              color: getTagColor(tag),
            });
          }
        }
      }
    }
  });

  return tagTethers;
};

// Deterministic color palette picker for tags
const TAG_COLORS = ['cyan', 'purple', 'emerald', 'amber', 'rose', 'indigo'];
const getTagColor = (tag = '') => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % TAG_COLORS.length;
  return TAG_COLORS[index];
};
