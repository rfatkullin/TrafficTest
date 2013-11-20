#!/bin/bash

node glue_stats.js 1_client/client_log1.txt > 1_client/results.txt
node glue_stats.js 2_client/client_log1.txt 2_client/client_log2.txt  > 2_client/results.txt
node glue_stats.js 3_client/client_log1.txt 3_client/client_log2.txt 3_client/client_log3.txt  > 3_client/results.txt
node glue_stats.js 4_client/client_log1.txt 4_client/client_log2.txt 4_client/client_log3.txt 4_client/client_log4.txt > 4_client/results.txt
node glue_stats.js 5_client/client_log1.txt 5_client/client_log2.txt 5_client/client_log3.txt 5_client/client_log4.txt 5_client/client_log5.txt > 5_client/results.txt

gnuplot	plotting_all.pl
gnuplot	plotting_begin.pl