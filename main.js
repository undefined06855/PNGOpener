coltypes = [
    "greyscale",
    "ERROR - OUT OF RANGE (1)",
    "truecolor",
    "indexed-color",
    "greyscale+alpha",
    "ERROR - OUT OF RANGE (5)",
    "truecolor+alpha"
]

validbitdepths = [
    [1, 2, 4, 8, 16],
    [-1],
    [8, 16],
    [1, 2, 4, 8],
    [8, 16],
    [-1],
    [8, 16]
]

descs = {
    "IHDR": "Image header chunk.",
    "PLTE": "Palette entries.",
    "IDAT": "Actual image data.",
    "IEND": "End of the image file.",
    "tRNS": "Indicates that the image uses \"simple\" transparency.",
    "gAMA": "The gamma value of the image.",
    "cHRM": "Specifies chromaticities of the red, green, and blue primaries.",
    "sRGB": "Indicates that the image conforms to the sRGB color space.",
    "iCCP": "Indicates that the image conforms to the embedded ICC profile.",
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

renderingintents = [
    "Perceptual",
    "Relative colorimetric",
    "Saturation",
    "Absolute colorimetric"
]

includesutf8 = ["iTXt", "tEXt"]
canparse = ["PLTE", "IHDR", "gAMA", "sRGB", "tRNS"]

document.querySelector("#wrapper").addEventListener("dragover", ev => {
    // janky stuff
    ev.preventDefault()
    ev.dataTransfer.effectAllowed = "all";
    ev.dataTransfer.dropEffect = "copy";
})

document.querySelector("#wrapper").addEventListener("drop", parse)
