$old = '<script>try { if (sessionStorage.getItem(''navFade'') === ''1'') { var overlay = document.createElement(''div''); overlay.className = ''page-fade-overlay active''; document.documentElement.appendChild(overlay); document.addEventListener(''DOMContentLoaded'', function () { try { document.body.style.visibility = ''hidden''; } catch (e) {} }); } } catch (e) {} </script>'
Get-ChildItem -Path . -Filter *.html -File | ForEach-Object {
    $path = $_.FullName
    $text = [System.IO.File]::ReadAllText($path)
    $new = $text.Replace($old, '')
    if ($new -ne $text) {
        [System.IO.File]::WriteAllText($path, $new, [System.Text.Encoding]::UTF8)
        Write-Host "patched $($_.Name)"
    }
}
