import NodeCache from "node-cache";

const cache = new NodeCache();

const TTL = {
  siteSettings: 3600, // 1 heure
  services: 1800, // 30 minutes
  vehicles: 300, // 5 minutes
};

export function get<T>(key: string): T | undefined {
  console.log("[CACHE] GET", key);

  return cache.get(key);
}

export function set<T>(key: string, value: T): boolean {
  const ttl = getTTL(key);
  console.log("[CACHE] TTL", ttl);
  console.log("[CACHE] Set", { key: key, value: value, ttl: ttl });
  return cache.set(key, value, ttl);
}

export function del(key: string): number {
  console.log("[CACHE] DEL", key);
  return cache.del(key);
}

export function flush(): void {
  console.log("[CACHE] FLUSH");
  cache.flushAll();
}

// Fonction helper pour déterminer le TTL basé sur la clé
function getTTL(key: string): number {
  if (key.startsWith("siteSettings")) return TTL.siteSettings;
  if (key.startsWith("services")) return TTL.services;
  if (key.startsWith("vehicles")) return TTL.vehicles;
  return TTL.siteSettings;
}
