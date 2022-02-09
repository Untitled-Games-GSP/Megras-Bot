#!/bin/bash

git pull
pm2 restart 1
printf "Updated and restarted bot\n"
