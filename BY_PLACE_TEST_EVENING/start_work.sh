#!/bin/bash

node glue_stats.js 1_one_client/client_log1.txt > 1_one_client/results.txt
node glue_stats.js 2_one_client/client_log2.txt > 2_one_client/results.txt
node glue_stats.js 3_one_client/client_log3.txt > 3_one_client/results.txt
node glue_stats.js 4_one_client/client_log4.txt > 4_one_client/results.txt
node glue_stats.js 5_one_client/client_log5.txt > 5_one_client/results.txt
node glue_stats.js 5_client/client_log5.txt 5_client/client_log2.txt 5_client/client_log3.txt 5_client/client_log4.txt 5_client/client_log5.txt > 5_client/results.txt

gnuplot	plotting.pl
gnuplot	plotting_all.pl

