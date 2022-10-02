import * as THREE from 'three';
export declare type GlbToThreeRecipeList = Array<{
    glob: string;
    material?: THREE.Material;
    onTraverse?: (obj: THREE.Object3D) => void;
    eject?: string;
}>;
export declare function glbToThree(gltf: {
    scene: THREE.Object3D;
}, recipeList: GlbToThreeRecipeList): {
    [name: string]: THREE.Object3D<THREE.Event>;
};
