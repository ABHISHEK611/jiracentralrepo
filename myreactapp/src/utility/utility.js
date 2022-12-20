export function searchTree(tree, key) {
    var i = 0;
    var result = null;
    while (i < tree.length) {
      result = searchNode(tree[i], key);
      if (result != null) {
        return result;
      }
      i++;
    }
    return result;
  }
  
  // recursion
  export function searchNode(element, key) {
    if (element.key === key) {
      return element;
    } else if (element.children != null) {
      var i;
      var result = null;
      for (i = 0; result == null && i < element.children.length; i++) {
        result = searchNode(element.children[i], key);
      }
      return result;
    }
    return null;
  }
  
  export const removeDraggingItem = (parentOfSurceItem, sourceItem) => {
    const index = parentOfSurceItem.children.indexOf(sourceItem);
    parentOfSurceItem.children.splice(index, 1);
    if (parentOfSurceItem.children.length < 1) {
      delete parentOfSurceItem.children;
    }
  };
  