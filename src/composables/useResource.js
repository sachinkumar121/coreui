export default function useResource() {
    const getResourceGroup = (standard_resource_name) => {
        switch (standard_resource_name) {
            case 'rooms':
                return 'Room';

            case 'equipment':
                return 'Equipment';

            default:
                return "Resource"
        }
    }
    return {
        getResourceGroup
    }
}