import minimatch from 'minimatch';
import * as THREE from 'three';
function traverseRecursive(current, parentPath, cb) {
    const currentPath = `${parentPath}/${current.name}`;
    if (current.children.length) {
        for (const child of current.children) {
            traverseRecursive(child, currentPath, cb);
        }
    }
    cb(currentPath, current);
}
export function glbToThree(gltf, recipeList) {
    const root = gltf.scene;
    const dfsList = [];
    for (const child of root.children) {
        traverseRecursive(child, '', (objPath, obj) => dfsList.push([objPath, obj]));
    }
    const ejectObj = {
        root,
    };
    for (const recipe of recipeList) {
        for (const [objPath, obj] of dfsList) {
            if (!minimatch(objPath, recipe.glob))
                continue;
            try {
                if (recipe.material && obj instanceof THREE.Mesh)
                    obj.material = recipe.material;
                if (recipe.onTraverse)
                    recipe.onTraverse(obj);
                if (recipe.eject)
                    ejectObj[recipe.eject] = obj;
            }
            catch (e) {
                console.error(e);
            }
        }
    }
    return ejectObj;
}
//# sourceMappingURL=glbToThree.js.map