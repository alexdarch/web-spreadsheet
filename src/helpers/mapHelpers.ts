export function MapsEqual<V>(
    map1: Map<string, V>,
    map2: Map<string, V>
): boolean {
    if (map1.size !== map2.size) {
        return false
    }

    for (let key in map1.keys()) {
        const v1 = map1.get(key)
        const v2 = map2.get(key)
        if (!v2 || v1 !== v2) {
            return false
        }
    }

    for (let key in map2.keys()) {
        const v1 = map1.get(key)
        const v2 = map2.get(key)
        if (!v1 || v1 !== v2) {
            return false
        }
    }

    return true
}
