LUCENT WEBSITE
==============

Everything in this folder goes in the root of the GitHub repository
caulculaslegend-dev/lucent, and GitHub Pages serves it at:

    https://caulculaslegend-dev.github.io/lucent/

index.html   the main site (download buttons, video, features, install steps, FAQ)
404.html     GitHub Pages shows this for any unknown address. It turns
             /lucent/u/<username> into that person's published Lucent setup.
lucent.json  switches on accounts in the app and on profile pages. Fill in the
             Supabase project URL and its public (anon) key. The app reads this
             file from the repository, so no new app build is needed.
assets/      screenshots, example wallpapers, the promo video, icons, and Lucent's
             own widget and effect scripts.


DOWNLOADS AND AUTO-UPDATE (GitHub Releases)
-------------------------------------------
Each release needs these three files, with these exact names:

    Lucent-mac-apple-silicon.dmg
    Lucent-mac-intel.dmg
    Lucent-windows-setup.exe

The tag is the version, for example v2.2.0. The site's download buttons always
point at the newest release, and the app's updater (Settings > Updates) checks it
too: a release with a higher version number than the installed app shows up as
an update.


TURNING ON GITHUB PAGES
-----------------------
Repository > Settings > Pages > Build and deployment > Deploy from a branch >
main, / (root) > Save. The site is live a minute later.
