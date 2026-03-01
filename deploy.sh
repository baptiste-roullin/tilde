#!/bin/sh
USER=boucan
HOST=ribambelle.club
DIR=public_html/   # le dossier du serveur que vers lequel voulez synchroniser, ici public_html qui est le dossier sur votre tilde où vous mettez vos pages web



rsync -avz --delete public_html/ ${USER}@${HOST}:~/${DIR}

exit 0