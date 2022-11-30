const coltypes = [
    "Greyscale",
    "ERROR - OUT OF RANGE (1)",
    "Truecolor",
    "Indexed-color",
    "Greyscale + alpha",
    "ERROR - OUT OF RANGE (5)",
    "Truecolor + alpha"
]

const validbitdepths = [
    [1, 2, 4, 8, 16],
    [-1],
    [8, 16],
    [1, 2, 4, 8],
    [8, 16],
    [-1],
    [8, 16]
]

const descs = {
    "IHDR": "Image header chunk. No chunks can appear before this.",
    "PLTE": "1 to 255 palette entries.",
    "IDAT": "The actual image data that is displayed.",
    "IEND": "Marks the end of the image file. No chunks can appear after this.",
    "tRNS": "Indicates that the image uses \"simple\" transparency.",
    "gAMA": "The gamma value of the image.",
    "cHRM": "Specifies chromaticities of the red, green, and blue primaries.",
    "sRGB": "Indicates that the image conforms to the sRGB color space.",
    "iCCP": "Indicates that the image conforms to the embedded ICC colour space.",
    "iTXt": "International text metadata about the image.",
    "tEXt": "Text metadata about the image.",
    "zTXt": "Compressed text metadata about the image.",
    "bKGD": "Represents default background color.",
    "pHYs": "Specifies intended pixel size or aspect ratio.",
    "sBIT": "Stores the original number of significant bits.",
    "sPLT": "Suggests a reduced color palette to be used.",
    "hIST": "Specifies the approximate usage frequency of each color in the palette.",
    "tIME": "Specifies the last time the image was modified."
}

const shortdescs = {
    "IHDR": "Image header",
    "PLTE": "Palette",
    "IDAT": "Image data",
    "IEND": "Image trailer",
    "tRNS": "Transparency",
    "gAMA": "Image gamma",
    "cHRM": "Primary chromaticities",
    "sRGB": "Standard RGB color space",
    "iCCP": "Embedded ICC Profile",
    "iTXt": "International textual data",
    "zTXt": "Compressed textual data",
    "tEXt": "Textual data",
    "bKGD": "Background colour",
    "pHYs": "Physical pixel dimension",
    "sBIT": "Significant bits",
    "sPLT": "Suggested palette",
    "hIST": "Palette histogram",
    "tIME": "Image last-modification time"
}

const renderingintents = [
    "Perceptual",
    "Relative colorimetric",
    "Saturation",
    "Absolute colorimetric"
]

// compressed chunks:
// iTXt (sometimes)
// zTXt (always)
// iCCP (only content compressed)

const canparse = ["PLTE", "IHDR", "gAMA", "sRGB", "tRNS", "iTXt", "tEXt", "zTXt", "tIME", "bKGD", "pHYs", "sPLT", "hIST", "sBIT", "cHRM", "iCCP"]

document.querySelector("#wrapper").addEventListener("dragover", ev => {
    // janky stuff
    ev.preventDefault()
    ev.dataTransfer.effectAllowed = "all";
    ev.dataTransfer.dropEffect = "copy";
})

document.querySelector("#wrapper").addEventListener("drop", parse)
