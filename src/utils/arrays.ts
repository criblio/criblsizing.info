export function updateArrayAndReturn(old: Array<any>, index: number, value: any) {
    var newArray = structuredClone(old);
    newArray[index] = value;
    return newArray
}