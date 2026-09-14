const labels_data = require('../data/labels.json');

let tunables_data = null;

async function download_tunables() {
    try {
        const response = await fetch('https://api.rdo.gg/tunables/gta/pcros/');
        tunables_data = await response.json();
        console.log('Tunables downloaded successfully from API.');
        return tunables_data;
    } catch (error) {
        console.error('Exception in download_tunables:', error);
        throw error;
    }
}

async function get_tunables_data() {
    if (!tunables_data) {
        await download_tunables();
    }
    return tunables_data;
}

function get_tunable(tunable) {
    if (!tunables_data) return 'loading...';
    let tunable_value = tunables_data.contents.tunables.BASE_GLOBALS[tunable];

    if (tunable_value !== undefined) {
        if (typeof tunable_value === 'string' && labels_data[tunable_value] !== undefined) {
            return labels_data[tunable_value];
        } else {
            return tunable_value;
        }
    } else {
        return 'invalid';
    }
}

module.exports = {
    download_tunables,
    get_tunables_data,
    get_tunable
};