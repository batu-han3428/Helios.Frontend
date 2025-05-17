export const arraysHaveSameItems = (array1, array2) => {
    const sortedArray1 = array1.slice().sort();
    const sortedArray2 = array2.slice().sort();

    if (sortedArray1.length !== sortedArray2.length) {
        return false;
    }

    for (let i = 0; i < sortedArray1.length; i++) {
        if (sortedArray1[i] !== sortedArray2[i]) {
            return false;
        }
    }

    return true;
};