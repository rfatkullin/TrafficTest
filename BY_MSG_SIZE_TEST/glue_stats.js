var fs  = require("fs");

var stats = {};

for ( var i = 2; i < process.argv.length; ++i )
{
	var linesArr = fs.readFileSync( process.argv[ i ] ).toString().split('\n');

	var mesCnt = 1;
	var speedSum = 0;
	var speed = 0;
	var res = 0;

	for ( var j = 0; j < linesArr.length; ++j )
	{
		var lineArr = linesArr[ j ].split( ' ' );

		switch ( lineArr[ 7 ] )
		{
			case '[STAT]' :
				res = speedSum / mesCnt;

				if ( stats[ speed ] == undefined )
					stats[ speed ] = res;
				else
					stats[ speed ] += res;

				mesCnt = 0;
				speedSum = 0;
				break;

			case 'New' :
				speed = Number( lineArr[ 12 ] );
				break;

			case 'Speed' :
				speedSum += Number( lineArr[ 9 ] );
				++mesCnt;
				break;
		}
	}

	res = speedSum / mesCnt;

	if ( stats[ speed ] == undefined )
		stats[ speed ] = res;
	else
		stats[ speed ] += res;
}

var filesCnt = process.argv.length - 2;
for ( var i in stats )
{
	console.log( i + ' ' + ( stats[ i ] / filesCnt ));
}
