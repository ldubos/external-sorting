#!/bin/bash

execjs="$(dirname $0)/exec.js"

hyperfine "$execjs number 500000" "$execjs string 500000" "$execjs object 500000" "$execjs number 1000000" "$execjs string 1000000" "$execjs object 1000000"
