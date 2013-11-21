set terminal svg size 800, 400
set output 'plot.svg'

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

plot '1_one_client/results.txt' using 1:2 with linespoints ls 1  title 'Ю-В Азия', \
     '2_one_client/results.txt' using 1:2 with linespoints ls 2  title 'З США', \
     '3_one_client/results.txt' using 1:2 with linespoints ls 3  title 'З США', \
     '4_one_client/results.txt' using 1:2 with linespoints ls 4  title 'В Азия', \
     '5_one_client/results.txt' using 1:2 with linespoints ls 5  title 'С Европа'
