$badEncoding = [System.Text.Encoding]::GetEncoding(1252)
$replacementPairs = @(
    $badEncoding.GetString([byte[]](0xE2,0x80,0xA2)), [char]0x2022,
    $badEncoding.GetString([byte[]](0xE2,0x80,0x94)), [char]0x2014,
    $badEncoding.GetString([byte[]](0xE2,0x80,0x93)), [char]0x2013,
    $badEncoding.GetString([byte[]](0xE2,0x96,0xBC)), [char]0x25BC,
    $badEncoding.GetString([byte[]](0xE2,0x86,0x92)), [char]0x2192,
    $badEncoding.GetString([byte[]](0xE2,0x86,0x90)), [char]0x2190,
    $badEncoding.GetString([byte[]](0xF0,0x9F,0x91,0x81)), 'Show',
    $badEncoding.GetString([byte[]](0xF0,0x9F,0x99,0x88)), 'Hide'
)

Get-ChildItem -Path . -Filter *.html -File | ForEach-Object {
    $path = $_.FullName
    $text = Get-Content -Path $path -Raw -Encoding UTF8
    $original = $text

    for ($i = 0; $i -lt $replacementPairs.Length; $i += 2) {
        $text = $text.Replace($replacementPairs[$i], $replacementPairs[$i + 1])
    }

    if ($text -ne $original) {
        Set-Content -Path $path -Value $text -Encoding UTF8
        Write-Host "patched $($path)"
    }
}
