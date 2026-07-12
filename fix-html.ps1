$replacements = @(
    @{From = ([char]0x00E2 + [char]0x0080 + [char]0x00A2); To = [char]0x2022},
    @{From = ([char]0x00E2 + [char]0x0080 + [char]0x0094); To = [char]0x2014},
    @{From = ([char]0x00E2 + [char]0x0080 + [char]0x0093); To = [char]0x2013},
    @{From = ([char]0x00E2 + [char]0x0086 + [char]0x0082); To = [char]0x2192},
    @{From = ([char]0x00E2 + [char]0x0086 + [char]0x0090); To = [char]0x2190},
    @{From = ([char]0x00E2 + [char]0x0086 + [char]0x009C); To = [char]0x25BC},
    @{From = ([char]0x00F0 + [char]0x009F + [char]0x0091 + [char]0x0081); To = 'Show'},
    @{From = ([char]0x00F0 + [char]0x009F + [char]0x0097 + [char]0x0088); To = 'Hide'}
)
$legacyScript = "<script>try { if (sessionStorage.getItem('navFade') === '1') { var overlay = document.createElement('div'); overlay.className = 'page-fade-overlay active'; document.documentElement.appendChild(overlay); document.addEventListener('DOMContentLoaded', function () { try { document.body.style.visibility = 'hidden'; } catch (e) {} }); } } catch (e) {} </script>"
$cleanScript = "<script>try { if (sessionStorage.getItem('navFade') === '1') { var overlay = document.createElement('div'); overlay.className = 'page-fade-overlay active'; document.documentElement.appendChild(overlay); } } catch (e) {} </script>"

Get-ChildItem -Path . -Filter *.html -File | ForEach-Object {
    $path = $_.FullName
    $text = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $original = $text
    foreach ($rep in $replacements) {
        $text = $text.Replace($rep.From, $rep.To)
    }
    $text = $text.Replace($legacyScript, $cleanScript)
    if ($text -ne $original) {
        [System.IO.File]::WriteAllText($path, $text, [System.Text.Encoding]::UTF8)
        Write-Host "patched $path"
    }
}
