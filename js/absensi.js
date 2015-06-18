$( document ).ready( function () {
	
	$( '#opt-bulan' ).val( myDate.getBulanNama() );
	$( '#opt-tahun' ).val( myDate.getTahun() );
	
	// Halaman awal adalah absensi
	pageName = 'absensi';

	_absensi.loadDefaultLoader();

	_rss.viewDefault();
	clock.digital.renderTime();
	_absensi.load();

	// Handler
	$( document ).on( 'click', '#btn-absensi', function() {

		myUrl = absensiUrl;
	
		_absensi.reload();
				
	} );

	$( document ).on( 'click', '#btn-monev', function() {

		myUrl = monevUrl;
	
		_monev.reload();

	} );
	
	$( document ).on( 'change', '#opt-bulan', function() {

		clearTimeout( data.timeoutVar );

		if ( pageName == 'absensi') {
			_absensi.load();
		} else {
			_monev.load();
		}
		
	} );

	$( document ).on( 'change', '#opt-tahun', function() {

		clearTimeout( data.timeoutVar );

		if ( pageName == 'absensi') {
			_absensi.load();
		} else {
			_monev.load();
		}
		
	} );
	
});

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
var pageName = 'absensi';

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
	return 'danger';
	
};
	
var data = {
	idSkpd: null, // Ganti null dengan id, jika spesifik untuk SKPD tertentu
	tableSize: 4, // Jumlah table untuk setiap waktu
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
		mei: [4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 25, 26, 27, 28, 29],
		juni: [ 1, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29, 30],
		juli: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
		agustus: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
		september: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
		oktober: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
		november: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
		desember: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],

		get: function( date ) {

			var _month = parseInt( date.month );
			var listHari;

			switch( _month ) {
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
			
			if ( _month == myDate.getNow().month )
				date = myDate.getNow();
			
			var _day = parseInt( date.day );
			
			while ( ! ( listHari.indexOf( _day ) ) || ( listHari.indexOf( _day ) < 1 ) ) {
				
				_day--;
				
				if ( _day == 0)
					return 0;
				
			}
			
			return listHari.indexOf( _day ) + 1;
		}
	}

};
	
var _absensi = {

	loadDefaultLoader: function () {
		
		var tmpLoader = [];
		loadBagian( 5 ); // Untuk semua bagian dalam suatu skpd
		tmpLoader = joinList( tmpLoader, listLoader );
		loadBagian( 6 ); // Untuk semua bagian dalam suatu skpd
		tmpLoader = joinList( tmpLoader, listLoader );
		loadBagian( 7 ); // Untuk semua bagian dalam suatu skpd
		tmpLoader = joinList( tmpLoader, listLoader );
		
		listLoader = tmpLoader;
		
	},

	reload: function() {
		
		message.writeLog( 'absensi.js:300: Reload absensi' );
		
		pageName = 'absensi';

		_absensi.loadDefaultLoader();
		
		$( '#opt-bulan' ).val( myDate.getBulanNama() );
		$( '#opt-tahun' ).val( myDate.getTahun() );
		
		clearTimeout( data.timeoutVar );
		
		data.loaderNumber = 0;
		
		_absensi.load();
		
	},

	load: function () {
			
		var tmp = listLoader[ data.loaderNumber ];
			
		_absensi.loadData( tmp.id );
			
	},

	loadData: function ( id ) {

		var bulan = $( '#opt-bulan' ).val();
		var tahun = $( '#opt-tahun' ).val();

		var tanggalAwal = myDate.createFirstDate( bulan, tahun );
		var awal = myDate.toFormattedString( tanggalAwal );

		var tanggalAkhir = myDate.createLastDate( bulan, tahun );
		var akhir = myDate.toFormattedString( tanggalAkhir );

		var object = {
			path: '/pegawai/rekap/bagian/' + id + '/' + awal + '/' + akhir,
			data: { },
			method: 'GET',
			success: function( result ) {

				if ( result.tipe == 'LIST' ) {

					_absensi.setData( result.list, 0 );
						
				} else if ( result.tipe != 'ERROR' ) {
						
					reloadLoadNumber( _absensi );
					
				}
			},
			error: message.error
		};

		rest.callAjaxFree( object );

	},
		
	setData: function ( list, pageNumber ) {
		
		var html = '';

		// Menentukan batas bawah dari data yang akan ditampilkan, sesuai nomor halaman dan jumlah data ddalam sekali tampil.
		// base adalah index pada list yang akan digunakan sebagai batas bawah.
		var base = ( pageNumber * data.tableSize );
		
		// Menentukan batas atas dari data yang akan ditampilkan, sesuai index batas bawah dan jumlah data dalam sekali tampil.
		// top adalah index pada list yang akan digunakan sebagai batas atas.
		var top = base + data.tableSize;

		// Gunakan index akhir list, jika batas atas lebih besar.
		if ( top > list.length )
			top = list.length;

		html += '<div class="list-group">';
		
		for ( var i = base; i < top; i++ ) {

			var tmp = list[ i ];

			// Ubah judul pada panel data.
			$( '#data-heading' ).html( '<b>' + tmp.bagian.nama.toUpperCase() + '</b>' );

			// Menentukan jumlah hari kerja dalam bulan berjalan (hariKerja),
			// presentase kehadiran terhadap jumlah hari kerja (presentase),
			// warna data sesuai presentase kehadiran (color).
			var tahun = $( '#opt-tahun' ).val();
			var bulan = $( '#opt-bulan' ).val();
			var tanggal = myDate.createLastDate( bulan, tahun );
			
			var hariKerja = data.hariKerja.get( tanggal );
			var presentase = Math.round( ( ( tmp.hadir / hariKerja ) * 100 ) );
			var color = getColor( presentase );

			// Implementasi seperti list-view.
			html += '<div class="list-group-item list-group-item-' + color + '">' +
				'<b class="list-group-item-heading">' + tmp.nip + ' - ' + tmp.nama + '</b>' +
				'<br /><br />' +
				'<div class="row">' +
					'<div class="col-md-2" col-xs-12>' +
					'<img src="images/default.jpg" height="100%" width="100%">' +
					'</div>' +
					'<div class="col-md-2 col-xs-4">' +
						'<div class="row">' +
							'<div class="col-md-12">' +
								'<p id="persentase" class="text-center">' + presentase + ' %</p>' +
								'<p class="text-center">' + hariKerja + ' hari</p>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="col-md-4 col-xs-4">' +
						'<p>Hadir : <b>' + ( tmp.hadir ? tmp.hadir : '-' ) + ' Hari</b></p>' +
						'<p>Sakit : <b>' + ( tmp.sakit ? tmp.sakit : '-' ) + ' Hari</b></p>' +
						'<p>TAP : <b>' + ( tmp.terlambat ? tmp.terlambat : '-' ) + ' Hari</b></p>' +
					'</div>' +
					'<div class="col-md-4 col-xs-4">' +
						'<p>Izin : <b>' + ( tmp.izin ? tmp.izin : '-' ) + ' Hari</b></p>' +
						'<p>Cuti : <b>' + ( tmp.cuti ? tmp.cuti : '-' ) + ' Hari</b></p>' +
						'<p>TAS : <b>' + ( tmp.pulang ? tmp.pulang : '-' ) + ' Hari</b></p>' +
					'</div>' +
				'</div>' +
			'</div>';

		}
		
		html += '</div>';

		page.change( $( '#data-body' ), html );

		// Menentukan sisa data yang masih akan ditampilkan.
		var sisa = list.length - ( top );

		if ( sisa > 0 ) {

			// Reload data dari list yang sama.
			data.timeoutVar = setTimeout( function() {
					
				_absensi.setData( list, ++pageNumber );
					
			}, data.timeout );
				
		} else {

			// Reload list baru dari server.
			data.timeoutVar = setTimeout( function() { 
			
				reloadLoadNumber( _absensi );
				
			}, data.timeout );
				
		}
	}
		
};

var _monev = {
	
	loadDefaultLoader: function () {
		
		throw new Error( 'Not Supported' );
		
	},
	
	reload: function() {
		
		message.writeLog( 'absensi.js:452: Reload monev' );

		pageName = 'monev';
		
		$( '#opt-bulan' ).val( myDate.getBulanNama() );
		$( '#opt-tahun' ).val( myDate.getTahun() );
		
		clearTimeout( data.timeoutVar );
		
		data.loaderNumber = 0;
		
		_monev.load();
		
		
	},
	
	load: function() {
			
		_monev.loadData();
			
	},
	
	loadData: function ( id ) {

		var object = {
			path: '/skpd/rekap/',
			data: { },
			method: 'GET',
			success: function( result ) {

				if ( result.tipe == 'LIST' ) {

					_monev.setData( result.list, 0 );
					
				}
			},
			error: message.error
		};

		rest.callAjaxFree( object );

	},
	
	setData: function ( list, pageNumber ) {

		// Ubah judul pada panel data.
		$( '#data-heading' ).html( '<b>MONITORING & EVALUASI PPA</b>' );
		
		var html = '';

		// Menentukan batas bawah dari data yang akan ditampilkan, sesuai nomor halaman dan jumlah data ddalam sekali tampil.
		// base adalah index pada list yang akan digunakan sebagai batas bawah.
		var base = ( pageNumber * data.tableSize );
		
		// Menentukan batas atas dari data yang akan ditampilkan, sesuai index batas bawah dan jumlah data dalam sekali tampil.
		// top adalah index pada list yang akan digunakan sebagai batas atas.
		var top = base + data.tableSize;

		// Gunakan index akhir list, jika batas atas lebih besar.
		if ( top > list.length )
			top = list.length;
			
		for ( var i = base; i < top; i++ ) {

			var tmp = list[ i ];

			// Implementasi seperti list-view.
			html += '<div class="placeholder">' +
				'<div class="panel panel-default">' +
					'<div class="panel-heading">' + tmp.nama + '</div>' +
					'<div class="panel-body">' +
						'<div class="col-md-12">' +
							'<p>Jumlah Kegiatan : ' + ( tmp.jumlahKegiatan ? tmp.jumlahKegiatan : '-' ) + ' kegiatan</p>' +
							'<p>Total Anggaran : Rp ' + ( tmp.totalAnggaran ? number.addCommas( tmp.totalAnggaran ) : '-' ) + '</p>' +
							'<p>Realisasi Anggaran : Rp ' + ( tmp.totalRealisasiAnggaran ? number.addCommas( tmp.totalRealisasiAnggaran ) : '-' )+ '</p>' +
							'<p>Realisasi Fisik : ' + ( tmp.totalRealisasiFisik ? tmp.totalRealisasiFisik : '-' ) + ' %</p>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>';

		}

		page.change( $( '#data-body' ), html );

		// Menentukan sisa data yang masih akan ditampilkan.
		var sisa = list.length - ( top );

		if ( sisa > 0 ) {

			// Reload data dari list yang sama.
			data.timeoutVar = setTimeout( function() {

				_monev.setData( list, ++pageNumber );

			}, data.timeout );

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