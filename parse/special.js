function parsechunkdata(data, chunktype)
{
    switch(chunktype)
    {
        case "PLTE":
            var str = "Palette entries:\n"
            var index = 0
            for (var offset = 0; offset < data.length; offset += 3)
            {
                str += "Entry " + index + ": " + data[offset] + ", " + data[offset + 1] + ", " + data[offset + 2] + "\n"
                index++
            }
            return str
        case "IHDR":
            width = arr32ToVal([
                data[0],
                data[1],
                data[2],
                data[3]
            ])

            height = arr32ToVal([
                data[4],
                data[5],
                data[6],
                data[7]
            ])

            bitdepth = data[8]


            coltype = coltypes[data[9]]

            isvalid = // this should be the same in every png file
            imageraw[0] == 137   &&
            imageraw[1] == 80    &&
            imageraw[2] == 78    &&
            imageraw[3] == 71    &&
            imageraw[4] == 13    &&
            imageraw[5] == 10    &&
            imageraw[6] == 26    &&
            imageraw[7] == 10    &&
            coltype != undefined &&
            height > 0           &&
            width > 0            &&
            bitdepthisvalid(data[9], data[8])

            return "Header Data:" +
            "\nSize: " + width.toString() + "x" + height.toString() +
            "\nBitDepth: " + bitdepth +
            "\nColour Type: " + coltype + " (" + data[9] + ")" +
            "\nValid Header: " + isvalid
        case "gAMA":
            gamaVal = arr32ToVal([
                data[0],
                data[1],
                data[2],
                data[3]
            ])

            return "Gamma value: " + gamaVal / 100000 + " (" + gamaVal + "÷100000)"
        case "sRGB":
            return "Rendering intent: " + renderingintents[data[0]] + " (" + data[0] + ")"
        case "tRNS":
            if (IHDR[9] == 0)
                return "Greyscale value being used as transparent: " + arr16ToVal([data[0], data[1]])
            if (IHDR[9] == 2)
                return "RGB value being used as transparent: " + arr16ToVal([data[0], data[1]]) + ", " + arr16ToVal([data[2], data[3]]) + ", " + arr16ToVal([data[4], data[5]])
            if (IHDR[9] == 3)
                var str = ""
                for (var i = 0; i < data.length; i++) str += "Alpha for palette " + i + ": " + data[i] + "\n"
                return str
        case "tEXt":
            return "Data as plain text:" + new TextDecoder().decode(data)
        case "iTXt":
            const desc = textToNullChar(data)
            const lang = textToNullChar(data, desc.end + 3)
            const keyw = textToNullChar(data, lang.end + 1, true)
            const text = textToNullChar(data, keyw.end + 1, true)
            return "Keyword: " + desc.str + "\nCompressed: " + (data[desc.end + 1] == 0 ? false : true) + "\nLanguage: " + lang.str + "\nKeyword: " + keyw.str + "\nText: " + text.str + (!(lang == "en" && lang == "") ? "\n\nNote: The above text may not be encoded correctly." : "")
        case "tIME":
            return "Last image modification date:\n" + data[3] + "/" + data[2] + "/" + data[0] + "" + data[1] + " @ " + data[4] + ":" + data[5] + ":" + data[6]
        case "bKGD":
            if (IHDR[9] == 3                ) return "Default background colour is palette entry " + data[0]
            if (IHDR[9] == 0 || IHDR[9] == 4) return "Default background colour is greyscale value " + arr16ToVal([data[0], data[1]])
            if (IHDR[9] == 2 || IHDR[9] == 6) return "Default background colour is " + arr16ToVal([data[0], data[1]]) + ", " + arr16ToVal([data[2], data[3]]) + ", " + arr16ToVal([data[4], data[5]])
        case "pHYs":
            if (data[8] == 0) return "Pixels per unit (X): " + arr32ToVal([data[0], data[1], data[2], data[3]]) + "\nPixels per unit (Y): " + arr32ToVal([data[4], data[5], data[6], data[7]])
            if (data[8] == 1) return "Pixels per inch (X): " + arr32ToVal([data[0], data[1], data[2], data[3]]) * 0.0254 + "\nPixels per inch (Y): " + arr32ToVal([data[4], data[5], data[6], data[7]]) * 0.0254
        case "sPLT":
            const name = textToNullChar(data)
            const depth = data[name.end + 1]
            
            var str = "Name: " + name.str + "\nDepth: " + depth

            if (depth == 8)
            {
                var entry = 0
                for (var i = name.end + 2; i < data.length; i += 6)
                {
                    str += "\nEntry " + entry + ": " + data[i] + ", " + data[i + 1] + ", " + data[i + 2] + ", " + data[i + 3] + ". Frequency: " + arr16ToVal([data[i + 4], data[i + 5]])
                    entry++
                }
            }
            else if (depth == 16)
            {
                var entry = 0
                for (var i = name.end + 2; i < data.length; i += 10)
                {
                    str += "\nEntry " + entry + ": " + arr16ToVal([data[i], data[i + 1]]) + ", " + arr16ToVal([data[i + 2], data[i + 3]]) + ", " + arr16ToVal([data[i + 4], data[i + 5]]) + ". Frequency: " + arr16ToVal([data[i + 6], data[i + 7]])
                    entry++
                }
            }

            return str
        case "hIST":
            var str = "Palette entry usages:"
            var entry = 0
            for (var i = 0; i < data.length; i += 2)
            {
                str += "\nEntry " + entry + ": " + arr16ToVal([data[i], data[i + 1]])
                entry++
            }

            return str
        case "sBIT":
            if (IHDR[9] == 0) return "Greyscale significant bytes: " + data[0]
            if (IHDR[9] == 2) return "Significant bytes (R): " + data[0] + "\nSignificant bytes (G): " + data[1] + "\nSignificant bytes (B): " + data[2]
            if (IHDR[9] == 3) return "Significant bytes (R): " + data[0] + "\nSignificant bytes (G): " + data[1] + "\nSignificant bytes (B): " + data[2]
            if (IHDR[9] == 4) return "Greyscale significant bytes: " + data[0] + "\nAlpha significant bytes: " + data[1]
            if (IHDR[9] == 6) return "Significant bytes (R): " + data[0] + "\nSignificant bytes (G): " + data[1] + "\nSignificant bytes (B): " + data[2] + "\nSignificant bytes (A): " + data[3]
        case "cHRM":
            return "" +
            "White point (X): " + arr32ToVal([data[0], data[1], data[2], data[3]]) / 100000 +
            "White point (Y): " + arr32ToVal([data[4], data[5], data[6], data[7]]) / 100000 +
            "Red (X): " + arr32ToVal([data[8], data[9], data[10], data[11]]) / 100000 +
            "Red (Y): " + arr32ToVal([data[12], data[13], data[14], data[15]]) / 100000 +
            "Green (X): " + arr32ToVal([data[16], data[17], data[18], data[19]]) / 100000 +
            "Green (Y): " + arr32ToVal([data[20], data[21], data[22], data[23]]) / 100000 +
            "Blue (X): " + arr32ToVal([data[24], data[25], data[26], data[27]]) / 100000 +
            "Blue (Y): " + arr32ToVal([data[28], data[29], data[30], data[31]]) / 100000
    }
}
