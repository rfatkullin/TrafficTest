set terminal svg size 800, 400
set output 'plot_all.svg'

set key outside
set key below

set lmargin 15.0
set rmargin 10.0

set format x "%g б."
set format y "%g Кб/сек."

set grid xtics
set grid ytics

set autoscale

set style line 1 lc 1 lt 1 lw 2 pt 7 pi -1 ps 1.5
set style line 2 lc 2 lt 1 lw 2 pt 7 pi -1 ps 1.5
set style line 3 lc 3 lt 1 lw 2 pt 7 pi -1 ps 1.5
set style line 4 lc 4 lt 1 lw 2 pt 7 pi -1 ps 1.5
set style line 5 lc 6 lt 1 lw 2 pt 7 pi -1 ps 1.5

set pointintervalbox 2

plot '1_client/results.txt' using 1:2 with linespoints ls 1  title 'Кол. клиентов=1', \
     '2_client/results.txt' using 1:2 with linespoints ls 2  title 'Кол. клиентов=2', \
     '3_client/results.txt' using 1:2 with linespoints ls 3  title 'Кол. клиентов=3', \
     '4_client/results.txt' using 1:2 with linespoints ls 4  title 'Кол. клиентов=4', \
     '5_client/results.txt' using 1:2 with linespoints ls 5  title 'Кол. клиентов=5'