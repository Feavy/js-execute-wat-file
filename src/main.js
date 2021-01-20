import 'regenerator-runtime/runtime'

const source = `
(module
    (import "js" "import1" (func $i1))
    (import "js" "import2" (func $i2))
    (func $main (call $i1))
    (start $main)
    (func (export "f") (call $i2))
)`;

var importObj = {
    js: {
        import1: () => console.log("hello,"),
        import2: () => console.log("world!")
    }
};

(async () => {
    const content = new TextEncoder().encode(source);
    require("wabt")().then(async wabt => {
        const wasmModule = wabt.parseWat("myModule", new Uint8Array(content));
        console.log("Module :")
        console.log(wasmModule);
        console.log("Source :")
        console.log(String.fromCharCode.apply(null, new Uint8Array(content)));
        console.log("Parsed :")
        console.log(wasmModule.toText({}));
        wasmModule.validate();
        console.log("Call :")
        const {module, instance} = await WebAssembly.instantiate(wasmModule.toBinary({}).buffer, importObj);
        instance.exports.f();
    });
})();
