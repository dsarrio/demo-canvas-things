const fs = require('fs');

const files = [
    'src/lib/tools.js',
    'src/effects/song.js',
    'src/effects/fx_sound.js',
    'src/effects/fx_intro.js',
    'src/effects/fx_crt.js',
    'src/effects/fx_sopalin.js',
    'src/effects/fx_flowers.js',
    'src/effects/fx_words.js',
    'src/effects/fx_tunnel.js',
    'src/effects/fx_cage3d.js',
    'src/effects/fx_credits.js',
    'src/demo.js',
];

const aliases = {
    'Math.sin': 'Ms',
    'Math.cos': 'Mc',
    'Math.pow': 'Mp',
    'Math.min': 'Mm',
    //'Math.PI': 'PI',
};

const renames = {
    ...aliases,

    'newContext': 'Co',
    'newCanvas': 'Ca',
    // 'tlerp': 'Tl',
    // 'lerp': 'TL',
    'Vector2': 'V2',
    'Vector3': 'V3',
    'Matrix4': 'M4',
    //'normalized': 'No',
    //'const': 'let',
}

fs.rmSync('.build', { recursive: true, force: true });
fs.mkdirSync('.build');  

fs.rmSync('.build/packed.js', { force: true });
for (var file of files) {
    var content = fs.readFileSync(file).toString('utf8');
    Object.keys(renames).forEach(k => {
        content = content.replaceAll(k, renames[k]);
    });
    fs.appendFileSync('.build/packed.js', content);
}

fs.rmSync('.build/aliased.js', { force: true });
Object.keys(aliases).forEach(k => {
    fs.appendFileSync('.build/aliased.js', aliases[k]+'='+k+';');
});
fs.appendFileSync('.build/aliased.js', fs.readFileSync('.build/packed.js'));
