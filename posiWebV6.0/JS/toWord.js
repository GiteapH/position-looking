


function getFileBinaryString(templateFile) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result);
        }
        reader.onerror = reject;
        reader.readAsBinaryString(templateFile);
    });
}

async function generateDocxFile(template, fileData) {
    return new Promise((resolve, reject) => {
        getFileBinaryString(template)
            .then(templateData => {
                const zip = new PizZip(templateData);
                const imageOpts = {
                    getImage(tag) {
                        console.log(tag)
                        return base64Parser(tag);
                    },
                    getSize() {
                        return [560, 480];
                    }
                }
                const doc = new docxtemplater(zip, {
                    modules: [new ImageModule(imageOpts)],
                })
                doc.render(fileData)
                const out = doc.getZip().generate({
                    type: 'blob',
                    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                });
                resolve(out)
            })
            .catch(reject);
    });
}

const Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/;
function base64Parser(dataURL) {
    if (
        typeof dataURL !== "string" ||
        !Regex.test(dataURL)
    ) {
        return false;
    }
    const stringBase64 = dataURL.replace(Regex, "");

    const binaryString = window.atob(stringBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        const ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes.buffer;
}
