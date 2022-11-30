function specialParse(data, chunktype)
{
    switch(chunktype)
    {
        case "PLTE":
            var str = "Palette entries:\n"
            var index = 0
            for (var offset = 0; offset < data.length; offset += 3)
            {
                str += toDetail("Entry " + index, data[offset] + ", " + data[offset + 1] + ", " + data[offset + 2])
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
            bitDepthValid(data[9], data[8])

            return "" +
            toDetail("Header Data", "") +
            toDetail("Image size", width.toString() + "x" + height.toString()) +
            toDetail("Bit depth", bitdepth) +
            toDetail("Colour Type", coltype + " (" + data[9] + ")") +
            toDetail("Valid Header", isvalid)
        case "gAMA":
            gamaVal = arr32ToVal([
                data[0],
                data[1],
                data[2],
                data[3]
            ])

            return toDetail("Gamma value", gamaVal / 100000 + " (" + gamaVal + "÷100000)")
        case "sRGB":
            return toDetail("Rendering intent", renderingintents[data[0]] + " (" + data[0] + ")")
        case "tRNS":
            if (IHDR[9] == 0)
                return toDetail("Greyscale value being used as transparent", arr16ToVal([data[0], data[1]]))
            if (IHDR[9] == 2)
                return toDetail("RGB value being used as transparent", arr16ToVal([data[0], data[1]]) + ", " + arr16ToVal([data[2], data[3]]) + ", " + arr16ToVal([data[4], data[5]]))
            if (IHDR[9] == 3)
                var str = ""
                for (var i = 0; i < data.length; i++) str += toDetail("Alpha for palette " + i, data[i])
                return str
        case "tEXt":
            const tdesc = textToNullChar(data)
            const ttext = textToNullChar(data, tdesc.end + 1)
            console.log(tdesc)
            console.log(ttext)
            return toDetail("Keyword", tdesc.str) + toDetail("Contents", ttext.str)
        case "iTXt":
            const idesc = textToNullChar(data)
            const ilang = textToNullChar(data, idesc.end + 3)
            const ikeyw = textToNullChar(data, ilang.end + 1, true)
            const itext = textToNullChar(data, ikeyw.end + 1, true)
            return toDetail("Keyword", idesc.str) + toDetail("Compressed", (data[idesc.end + 1] == 0 ? false : true)) + toDetail("Language", ilang.str) + toDetail("Keyword", ikeyw.str)+ toDetail("Text", itext.str) + (!(ilang == "en" && ilang == "") ? toDetail("\nNote", "The above text may not be encoded correctly.") : "")
        case "zTXt":
            return toDetail("Keyword", textToNullChar(data).str)
        case "tIME":
            return toDetail("Last image modification date: ", data[3] + "/" + data[2] + "/" + data[0] + "" + data[1] + " @ " + data[4] + ":" + data[5] + ":" + data[6])
        case "bKGD":
            if (IHDR[9] == 3                ) return  toDetail("Default background colour", "Palette entry " + data[0])
            if (IHDR[9] == 0 || IHDR[9] == 4) return  toDetail("Default background colour", "Greyscale value " + arr16ToVal([data[0], data[1]]))
            if (IHDR[9] == 2 || IHDR[9] == 6) return  toDetail("Default background colour", arr16ToVal([data[0], data[1]]) + ", " + arr16ToVal([data[2], data[3]]) + ", " + arr16ToVal([data[4], data[5]]))
        case "pHYs":
            if (data[8] == 0) return toDetail("Pixels per unit (X)", arr32ToVal([data[0], data[1], data[2], data[3]])) + toDetail("Pixels per unit (Y)", arr32ToVal([data[4], data[5], data[6], data[7]]))
            if (data[8] == 1) return toDetail("Pixels per inch (X)", arr32ToVal([data[0], data[1], data[2], data[3]]) * 0.0254) + toDetail("Pixels per inch (Y)", arr32ToVal([data[4], data[5], data[6], data[7]]) * 0.0254)
        case "sPLT":
            const palname = textToNullChar(data)
            const depth = data[palname.end + 1]
            
            var str = "Name: " + palname.str + "\nDepth: " + depth

            if (depth == 8)
            {
                var entry = 0
                for (var i = palname.end + 2; i < data.length; i += 6)
                {
                    str += toDetail("Entry " + entry, data[i] + ", " + data[i + 1] + ", " + data[i + 2] + ", " + data[i + 3], false) + toDetail("Frequency", arr16ToVal([data[i + 4], data[i + 5]]))
                    entry++
                }
            }
            else if (depth == 16)
            {
                var entry = 0
                for (var i = palname.end + 2; i < data.length; i += 10)
                {
                    str += toDetail("Entry " + entry, arr16ToVal([data[i], data[i + 1]]) + ", " + arr16ToVal([data[i + 2], data[i + 3]]) + ", " + arr16ToVal([data[i + 4], data[i + 5]])) + toDetail("Frequency", arr16ToVal([data[i + 6], data[i + 7]]))
                    entry++
                }
            }

            return str
        case "hIST":
            var str = "Palette entry usages: "
            var entry = 0
            for (var i = 0; i < data.length; i += 2)
            {
                str += toDetail("Entry " + entry, arr16ToVal([data[i], data[i + 1]]))
                entry++
            }

            return str
        case "sBIT":
            if (IHDR[9] == 0) return toDetail("Greyscale significant bits", data[0])
            if (IHDR[9] == 2) return toDetail("Significant bits (R)", data[0]) + toDetail("Significant bits (G)", data[1]) + toDetail("Significant bits (B)", data[2])
            if (IHDR[9] == 3) return toDetail("Significant bits (R)", data[0] + "\nSignificant bits (G)" + data[1] + "\nSignificant bits (B)" + data[2])
            if (IHDR[9] == 4) return toDetail("Greyscale significant bits", data[0]) + toDetail("Alpha significant bits", data[1])
            if (IHDR[9] == 6) return toDetail("Significant bits (R)", data[0]) + toDetail("Significant bits (G)", data[1]) + toDetail("Significant bits (B)", data[2]) + toDetail("Significant bits (A)", data[3])
        case "cHRM":
            return "" +
            toDetail("White point (X)", arr32ToVal([data[0], data[1], data[2], data[3]]) / 100000) +
            toDetail("White point (Y)", arr32ToVal([data[4], data[5], data[6], data[7]]) / 100000) +
            toDetail("Red (X)", arr32ToVal([data[8], data[9], data[10], data[11]]) / 100000) +
            toDetail("Red (Y)", arr32ToVal([data[12], data[13], data[14], data[15]]) / 100000) +
            toDetail("Green (X)", arr32ToVal([data[16], data[17], data[18], data[19]]) / 100000) +
            toDetail("Green (Y)", arr32ToVal([data[20], data[21], data[22], data[23]]) / 100000) +
            toDetail("Blue (X)", arr32ToVal([data[24], data[25], data[26], data[27]]) / 100000) +
            toDetail("Blue (Y)", arr32ToVal([data[28], data[29], data[30], data[31]]) / 100000)
        case "iCCP":
            const profilename = textToNullChar(data)
            return toDetail("Profile name", profilename.str) + toDetail("Compression method", data[profilename.end + 1])

        case "IDAT":
        case "IEND":
        default: console.warn("Chunk type " + chunktype + " cannot be parsed!")
    }
}
