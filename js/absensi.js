$( document ).ready( function () {
	
	// Halaman awal adalah rekap
	pageName = 'rekap';
	data.pilih = 'bagian';

	loadDefaultLoader();

	page.load( $( '#content-absen' ), 'html/rekap.html');
	page.load( $( '#option-panel' ), 'html/rekap-option.html' );
	
	$( '#absen-tanggal-awal' ).val( myDate.getAwalDatePicker() );
	$( '#absen-tanggal-akhir' ).val( myDate.getAkhirDatePicker() );

	_rss.viewDefault();
	clock.digital.renderTime();
	
	_rekap.load();

	// Handler
	$( document ).on( 'click', '#btn-rekap', function() {

		pageName = 'rekap';

		loadDefaultLoader();

		page.load( $( '#content-absen' ), 'html/rekap.html');
		page.load( $( '#option-panel' ), 'html/rekap-option.html' );
	
		$( '#absen-tanggal-awal' ).val( myDate.getAwalDatePicker() );
		$( '#absen-tanggal-akhir' ).val( myDate.getAkhirDatePicker() );
		
		clearTimeout( data.timeoutVar );
		
		data.loaderNumber = 0;
		
		_rekap.load();
		
	} );

	$( document ).on( 'click', '#btn-ranking', function() {

		pageName = 'ranking';
		
		loadSkpd();
		
		page.load( $( '#content-absen' ), 'html/ranking.html');
		page.load( $( '#option-panel' ), 'html/ranking-option.html' );
	
		$( '#absen-tanggal-awal' ).val( myDate.getAwalDatePicker() );
		$( '#absen-tanggal-akhir' ).val( myDate.getAkhirDatePicker() );
		
		clearTimeout( data.timeoutVar );
		
		data.loaderNumber = 0;
		
		_ranking.load();

	} );
	
	$( document ).on( 'change', '#absen-tanggal-awal', function() {

		clearTimeout( data.timeoutVar );

		if ( pageName == 'rekap') {
			_rekap.load();
		} else {
			_ranking.load();
		}
		
	} );

	$( document ).on( 'change', '#absen-tanggal-akhir', function() {

		clearTimeout( data.timeoutVar );

		if ( pageName == 'rekap') {
			_rekap.load();
		} else {
			_ranking.load();
		}
		
	} );

	$( document ).on( 'change', '#absen-pilih', function() {

		clearTimeout( data.timeoutVar );

		data.pilih = $( '#absen-pilih' ).val();
		
		if ( !data.pilih)
			return;
		
		if ( data.pilih == 'skpd' ) {

			data.pilih = 'skpd';
			loadSkpd();
			
		} else if ( data.pilih == 'bagian' ) {

			data.pilih = 'bagian';
			
			if ( pageName == 'rekap') {
				
				loadDefaultLoader();
				
			} else {
				
				loadSkpd();
				
			}
			
		}
		
		data.loaderNumber = 0;

		if ( pageName == 'rekap') {
			_rekap.load();
		} else {
			_ranking.load();
		}
		
	} );
});

function loadDefaultLoader() {
	
	var tmpLoader = [];
	loadBagian( 5 ); // Untuk semua bagian dalam suatu skpd
	tmpLoader = joinList( tmpLoader, listLoader );
	loadBagian( 6 ); // Untuk semua bagian dalam suatu skpd
	tmpLoader = joinList( tmpLoader, listLoader );
	loadBagian( 7 ); // Untuk semua bagian dalam suatu skpd
	tmpLoader = joinList( tmpLoader, listLoader );
	
	listLoader = tmpLoader;
	
};

function joinList( list1, list2 ) {

	if ( !list2 )
		return list1;
	
	var firstIndex = list1.length;
	var index = 0;
	for ( index = 0; index < list2.length; index++ ) {
		
		list1[ firstIndex ] = list2[ index ];
		firstIndex++;
		
	}
	
	return list1;
	
};


// Load data SKPD ke dalam list.
function loadSkpd() {

	var object = {
		path: '/skpd',
		data: { },
		method: 'GET',
		success: function( result ) {

			if ( result.tipe == 'LIST' )
				listLoader = result.list;

		},
		error: message.error
	};

	rest.callAjaxFree( object );
};

// Load data Bagian (berdasarkan skpd) ke dalam list.
function loadBagian( idSkpd ) {

	var object = {
		path: '/bagian',
		data: { },
		method: 'GET',
		success: function( result ) {

			if ( result.tipe == 'LIST' )
				listLoader = result.list;

		},
		error: message.error
	};
		
	// Load bagian berdasarkan skpd, jika idSkpd ditemukan
	if ( idSkpd )
		object.path = '/bagian/skpd/' + idSkpd;
		
	rest.callAjaxFree( object );
};
	
var listLoader = [ ];
var pageName = 'rekap';

function reloadLoadNumber( container ) {
				
	if ( ( data.loaderNumber + 1 ) < listLoader.length ) {
					
		data.loaderNumber++;
					
	} else {
					
		data.loaderNumber = 0;
					
	}
				
	container.load();
				
};

function getColor( presentase ) {
	
	if ( presentase > 80 )
		return 'success';
	if ( presentase > 60 )
		return 'warning';
	return 'error';
};

	
var data = {
	idSkpd: null, // Ganti null dengan id, jika spesifik untuk SKPD tertentu
	tableSize: 4, // Jumlah table untuk setiap waktu
	hariKerja: 22,
	currentPage: 0,
	pilih: 'skpd',
	tanggalAwal: myDate.getNow(),
	tanggalAkhir: myDate.getNow(),
	loaderNumber: 0, // Load mulai dari 0
	timeout: 10000, // Rentang waktu untuk berganti data absen
	timeoutVar: '',
	
	hariKerja: {

		januari: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
		februari: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
		maret: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
		april: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
		mei: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
		juni: [ 1, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29, 30 ],
		juli: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
		agustus: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
		september: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
		oktober: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
		november: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
		desember: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
			
		get: function( date ) {

			date = myDate.getNow();
			var listHari;

			switch( date.month ) {
				case 1: 
					listHari = this.januari;
					break;
				case 2: 
					listHari = this.februari;
					break;
				case 3: 
					listHari = this.maret;
					break;
				case 4: 
					listHari = this.april;
					break;
				case 5: 
					listHari = this.mei;
					break;
				case 6: 
					listHari = this.juni;
					break;
				case 7: 
					listHari = this.juli;
					break;
				case 8: 
					listHari = this.agustus;
					break;
				case 9: 
					listHari = this.september;
					break;
				case 10: 
					listHari = this.oktober;
					break;
				case 11: 
					listHari = this.november;
					break;
				case 12: 
					listHari = this.desember;
					break;
			}
			
			message.writeLog( date );
			message.writeLog( listHari );
			
			return listHari.indexOf( date.day ) + 1;
		}
	}
		
};
	
var _rekap = {

	load: function loadRekap() {
			
		var tmp = listLoader[ data.loaderNumber ];
			
		_rekap.loadData( tmp.id);
			
	},

	loadData:	function ( id ) {

		var awal = myDate.formatDatePicker( $( '#absen-tanggal-awal' ).val() );
		var akhir = myDate.formatDatePicker( $( '#absen-tanggal-akhir' ).val() );

		var object = {
			path: '/pegawai/rekap/bagian/' + id + '/' + awal + '/' + akhir,
			data: { },
			method: 'GET',
			success: function( result ) {

				if ( result.tipe == 'LIST' ) {

					_rekap.setData( result.list, 0 );
						
				} else {
						
					reloadLoadNumber( _rekap );
						
				}
			},
			error: message.error
		};

		if ( data.pilih == 'skpd' )
			object.path ='/pegawai/rekap/skpd/' + id + '/' + awal + '/' + akhir;

		rest.callAjaxFree( object );

	},
		
	setData: function ( list, pageNumber ) {

		var tanggalAwal = $( '#absen-tanggal-awal' ).val();
			
		var html = '';

		var base = ( pageNumber * data.tableSize);
		var top = base + data.tableSize;

		if ( top > list.length )
			top = list.length;
			
		for ( var i = base; i < top; i++ ) {

			var tmp = list[ i ];
				
		$( '#nama-skpd' ).html( tmp.bagian.skpd.nama );			
		$( '#nama-bagian' ).html( tmp.bagian.nama );
				
		if ( data.pilih == 'skpd' )
			$( '#nama-bagian' ).html( 'Semua Bagian' );

		
			var hariKerja = data.hariKerja.get( tanggalAwal );
			var presentase = Math.round( ( ( tmp.hadir / hariKerja ) * 100 ) );
		
			var color = getColor( presentase );
				
			html += '<tr class="' + color + '">' +
				'<td>' + tmp.nip + '</td>' +
				'<td>' + tmp.nama + '</td>' +
				'<td>' + tmp.jabatan + '</td>' +
				'<td>' + hariKerja + '</td>' +
				'<td>' + tmp.hadir + '</td>' +
				'<td>' + tmp.terlambat + '</td>' +
				'<td>' + tmp.pulang + '</td>' +
				'<td>' + tmp.sakit + '</td>' +
				'<td>' + tmp.izin + '</td>' +
				'<td>' + tmp.cuti + '</td>' +
				'<td>' + presentase + ' %</td>' +
				'</tr>';
		}

		page.change( $( '#table-rekap' ), html );
			
		var sisa = list.length - ( top );

		if ( sisa > 0 ) {
				
			var reload = function() {
					
				_rekap.setData( list, ++pageNumber );
					
			}

			data.timeoutVar = setTimeout( reload, data.timeout);
				
		} else {
				
			data.timeoutVar = setTimeout( function() { 
				reloadLoadNumber( _rekap );
			}, data.timeout);
				
		}
	}
		
};

var _ranking = {

	load: function() {
			
		var tmp = listLoader[ data.loaderNumber ];
			
		_ranking.loadData( tmp.id);			

	},
	
	loadData: function( id ) {

		var awal = myDate.formatDatePicker( $( '#absen-tanggal-awal' ).val() );
		var akhir = myDate.formatDatePicker( $( '#absen-tanggal-akhir' ).val() );

		var object = {
			path: '/bagian/rekap/' + id + '/' + awal + '/' + akhir,
			data: { },
			method: 'GET',
			success: function( result ) {

				if ( result.tipe == 'LIST' ) {

					_ranking.setData( result.list, 0 );
						
				} else {
						
					reloadLoadNumber( _ranking );
						
				}
			},
			error: message.error
		};

		if ( data.pilih == 'skpd' )
			object.path ='/skpd/rekap/' + awal + '/' + akhir;

		rest.callAjaxFree( object );

	},
	
	setData: function( list, pageNumber ) {

		var tanggalAwal = $( '#absen-tanggal-awal' ).val();
			
		var html = '';

		var base = ( pageNumber * data.tableSize);
		var top = base + data.tableSize;

		if ( top > list.length )
			top = list.length;
			
		for ( var i = base; i < top; i++ ) {

			var tmp = list[ i ];

			var presentase = Math.round( ( ( tmp.hadir / ( tmp.jumlahPegawai * data.hariKerja.get( tanggalAwal ) ) ) * 100 ) );
								
			// Ubah Nama SKPD pada kanan atas
			if ( data.pilih == 'skpd' ) {
				
				$( '#nama-skpd' ).html( 'Semua SKPD' );
				$( '#nama-bagian' ).html( 'Semua Bagian' );
		
				var color = getColor( presentase );
					
				html += '<tr class="' + color + '">' +
					'<td>' + tmp.nama + '</td>' +
					'<td>Semua</td>' +
					'<td>' + tmp.jumlahPegawai + '</td>' +
					'<td>' + presentase + ' %</td>' +
					'</tr>';
				
			} else {
				
				$( '#nama-skpd' ).html( tmp.skpd.nama );
				$( '#nama-bagian' ).html( 'Semua Bagian' );
		
				var color = getColor( presentase );
					
				html += '<tr class="' + color + '">' +
					'<td>' + tmp.skpd.nama + '</td>' +
					'<td>' + tmp.nama + '</td>' +
					'<td>' + tmp.jumlahPegawai + '</td>' +
					'<td>' + presentase + ' %</td>' +
					'</tr>';
				
			}
			
		}

		page.change( $( '#table-rekap' ), html );
			
		var sisa = list.length - ( top );

		if ( sisa > 0 ) {
				
			var reload = function() {
					
				_ranking.setData( list, ++pageNumber );
					
			}

			data.timeoutVar = setTimeout( reload, data.timeout);
				
		} else {
				
			data.timeoutVar = setTimeout( function() { 
				reloadLoadNumber( _ranking );
			}, data.timeout);
				
		}
	}
	
};

var clock = {
	
	itemNumber: 0,

	view: function() {
		
		var canvas = document.getElementById("clock");
		var ctx = canvas.getContext("2d");
		var radius = canvas.height / 2;
		ctx.translate(radius, radius);
		radius = radius * 0.90

		setInterval( function() {
			clock.drawClock( ctx, radius );			
		}, 1000 );
	},
	
	drawClock: function ( ctx, radius ) {
	  clock.drawFace( ctx, radius );
	  clock.drawNumbers( ctx, radius );
	  clock.drawTime( ctx, radius );
	},

	drawFace: function (ctx, radius) {
	  var grad;
	  ctx.beginPath();
	  ctx.arc(0, 0, radius, 0, 2*Math.PI);
	  ctx.fillStyle = 'white';
	  ctx.fill();
	  grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
	  grad.addColorStop(0, '#333');
	  grad.addColorStop(0.5, 'white');
	  grad.addColorStop(1, '#333');
	  ctx.strokeStyle = grad;
	  ctx.lineWidth = radius*0.1;
	  ctx.stroke();
	  ctx.beginPath();
	  ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
	  ctx.fillStyle = '#333';
	  ctx.fill();
	},

	drawNumbers: function (ctx, radius) {
	  var ang;
	  var num;
	  ctx.font = radius*0.15 + "px arial";
	  ctx.textBaseline="middle";
	  ctx.textAlign="center";
	  for(num = 1; num < 13; num++){
	    ang = num * Math.PI / 6;
	    ctx.rotate(ang);
	    ctx.translate(0, -radius*0.85);
	    ctx.rotate(-ang);
	    ctx.fillText(num.toString(), 0, 0);
	    ctx.rotate(ang);
	    ctx.translate(0, radius*0.85);
	    ctx.rotate(-ang);
	  }
	},

	drawTime: function (ctx, radius){
	    var now = new Date();
	    var hour = now.getHours();
	    var minute = now.getMinutes();
	    var second = now.getSeconds();
	    //hour
	    hour=hour%12;
	    hour=(hour*Math.PI/6)+
	    (minute*Math.PI/(6*60))+
	    (second*Math.PI/(360*60));
	    clock.drawHand(ctx, hour, radius*0.5, radius*0.07);
	    //minute
	    minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
	    clock.drawHand(ctx, minute, radius*0.8, radius*0.07);
	    // second
	    second=(second*Math.PI/30);
	    clock.drawHand(ctx, second, radius*0.9, radius*0.02);
	},

	drawHand: function (ctx, pos, length, width) {
	    ctx.beginPath();
	    ctx.lineWidth = width;
	    ctx.lineCap = "round";
	    ctx.moveTo(0,0);
	    ctx.rotate(pos);
	    ctx.lineTo(0, -length);
	    ctx.stroke();
	    ctx.rotate(-pos);
	},
	
	digital: {
		
		renderTime: function () {
			var currentTime = new Date();
			var h = currentTime.getHours();
			var m = currentTime.getMinutes();
		    var s = currentTime.getSeconds();

			setTimeout( clock.digital.renderTime, 1000);
		    
			if (h == 0) {
				h = 12;
			}
			if (h < 10) {
				h = "0" + h;
			}
			if (m < 10) {
				m = "0" + m;
			}
			if (s < 10) {
				s = "0" + s;
			}

			page.change( $( '#watch' ), h + ":" + m + ":" + s );
			
		}		
	}
	
};

var _rss = {
	
	itemIndex: 0,
	
	view: function() {
		
        $( '#rss' )
          .hide()
          .rss( 'http://www.sangihekab.go.id/home/rss', {
            limit: 15,
            effect: 'slideFastSynced',
            layoutTemplate: '{entries}',
            entryTemplate: '<h3>{title}</h3><div><p>{bodyPlain}</p>'
          }, function() {
            $( 'rss')
              .show()
              .find('> div')
              .accordion( { heightStyle: 'content' } )
          });
		
	},
	
	viewDefault: function() {

		page.change( $( '#rss' ), '' );
		
		$( '#rss' ).rss( 'http://www.sangihekab.go.id/home/rss', 
			{
				limit: 100,
	            effect: 'slideFastSynced',
	            entryTemplate: '<p>{dynamic}</p>',
				tokens: {
					dynamic: function( entry, tokens ) {
						
						var totalEntries = tokens.totalEntries;
						
						if ( _rss.itemIndex > totalEntries )
							_rss.itemIndex = 0;
						
						if ( tokens.index == _rss.itemIndex ) {
							
							return tokens.bodyPlain;
						}
						
						return ' ';
					}
				}
			} ).show();
		
		setTimeout( function() {
			_rss.itemIndex++;
			_rss.viewDefault();
		}, 7000);

	},
	
	viewFeedMikle: function() {
		
		var params = {
			rssmikle_url: "http://www.sangihekab.go.id/home/rss",
			rssmikle_frame_width: "300",
			rssmikle_frame_height: "200",
			frame_height_by_article: "1",
			rssmikle_target: "_blank",
			rssmikle_font: "Arial, Helvetica, sans-serif",
			rssmikle_font_size: "12",
			rssmikle_border: "off",
			responsive: "off",
			rssmikle_css_url: "",
			text_align: "left",
			text_align2: "left",
			corner: "off",
			scrollbar: "on",
			autoscroll: "on",
			scrolldirection: "up",
			scrollstep: "3",
			mcspeed: "20",
			sort: "Off",
			rssmikle_title: "on",
			rssmikle_title_sentence: "",
			rssmikle_title_link: "",
			rssmikle_title_bgcolor: "#0066FF",
			rssmikle_title_color: "#FFFFFF",
			rssmikle_title_bgimage: "",
			rssmikle_item_bgcolor: "#FFFFFF",
			rssmikle_item_bgimage: "",
			rssmikle_item_title_length: "55",
			rssmikle_item_title_color: "#0066FF",
			rssmikle_item_border_bottom: "on",
			rssmikle_item_description: "on",
			item_link: "off",
			rssmikle_item_description_length: "150",
			rssmikle_item_description_color: "#666666",
			rssmikle_item_date: "gl1",
			rssmikle_timezone: "Etc/GMT",
			datetime_format: "%b %e, %Y %l:%M:%S %p",
			item_description_style: "text+tn",
			item_thumbnail: "full",
			item_thumbnail_selection: "auto",
			article_num: "15",
			rssmikle_item_podcast: "off",
			keyword_inc: "",
			keyword_exc: ""
		};
		
		feedwind_show_widget_iframe( params, $( '#rss' ).html() );
		
	}
	
}