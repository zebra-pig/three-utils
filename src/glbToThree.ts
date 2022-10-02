import minimatch from 'minimatch';
import * as THREE from 'three';

function traverseRecursive(
    current: THREE.Object3D, 
    parentPath: string,
    cb: (objPath: string, obj: THREE.Object3D) => void, 
)
{
    const currentPath = `${parentPath}/${current.name}`;

    if (current.children.length)
    {
        for (const child of current.children)
        {
            traverseRecursive(child, currentPath, cb);
        }
    }

    cb(currentPath, current);
}

export type GlbToThreeRecipeList = Array<{
    glob: string;
    material?: THREE.Material;
    onTraverse?: (obj: THREE.Object3D) => void;
    eject?: string;
}>

export function glbToThree(gltf: { scene: THREE.Object3D }, recipeList: GlbToThreeRecipeList)
{
    const root = gltf.scene;

    const dfsList: Array<[ string, THREE.Object3D ]> = [];

    for (const child of root.children)
    {
        traverseRecursive(child, '', 
            (objPath: string, obj: THREE.Object3D) => dfsList.push([ objPath, obj ])
        );
    }

    const ejectObj: { [ name: string ]: THREE.Object3D } = 
    {
        root,
    };

    for (const recipe of recipeList)
    {
        for (const [ objPath, obj ] of dfsList)
        {
            if (!minimatch(objPath, recipe.glob))
                continue;

            try
            {
                if (recipe.material && obj instanceof THREE.Mesh)
                    obj.material = recipe.material;

                if (recipe.onTraverse)
                    recipe.onTraverse(obj);

                if (recipe.eject)
                    ejectObj[recipe.eject] = obj;
            }
            catch (e)
            {
                console.error(e);
            }
        }
    }

    return ejectObj;
}