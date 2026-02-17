exports.resolveConflict = (existing, incoming) => {
  if (!existing) return incoming;

  if (new Date(incoming.updatedAt) > new Date(existing.updatedAt)) {
    return incoming;
  }

  return existing;
};
