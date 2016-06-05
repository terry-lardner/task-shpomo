(function() {
	var $teasers = $('.teasers');
	var $teasersContainer = $teasers.find('.container');	 
	var $lookupError = $teasers.find('#lookupError');
	var template = $teasers.find('#pixabayTemplate').html();
	var $teaser;
	var $modalLink;

	var $modal = $('#modal');
	var $modalImg = $modal.find('#modalImg');
	var modalActive = 0;

	var results = 7;	

	function render(obj) {
		$teasersContainer.append(Mustache.render(template, obj));
	}

	function pixabayLookup() {
		$.ajax({
			type: 'GET',
			url: 'https://pixabay.com/api/?key=2682955-f309748441ab481ea9cde10a6&q=hot+air+balloon&image_type=photo&safesearch=true&per_page=' + results,
			success: function(data) {
				if (data) {
					$.each(data.hits, function(i, result) {						
						result.img_url = result.webformatURL;
						result.page_url = result.pageURL;
						result.user_page = 'https://pixabay.com/en/users/' + result.user + '-' + result.user_id;
						render(result);
					});

					//Cache elements after all teasers are rendered.
					$teaser = $teasers.find('.teaser');
					$modalLink = $teasers.find('.modal-link');

					//Add a gutter to every middle element	
					for(i=1; i<=$teaser.length; i+=3) {
						$teaser.eq(i).addClass('gutter');
					}

					bindEvents();
				}
			},
			error: function() {
				$lookupError.removeClass('hide');
				$lookupError.html('ERROR Retreiving data!');
			}
		});
	}

	function bindEvents() {
		//Bind events to elements
		$teaser.on('mouseenter', function() {
			$teaserImg = $(this).find('img');
			$(this).addClass('teaser-highlight');	
			$teaserImg.addClass('teaser-img-border-active');	
		});

		$teaser.on('mouseleave', function() {
			$(this).removeClass('teaser-highlight');
			$teaserImg.removeClass('teaser-img-border-active');
		});

		$modalLink.on('click', function() {
	 		$modal.removeClass('hide');
	 		$modal.css('top', document.documentElement.scrollTop || document.body.scrollTop)
	 		$('html').css('overflow', 'hidden');
	 		$modalImg.attr('src', $(this).data('imgurl'));
	 		modalActive = 1;
	 	});

	 	$modal.on('click', function() {
	 		$modal.addClass('hide');
	 		$('html').css('overflow', 'auto');
	 		modalActive = 0;
	 	});
	}

	//Resize modal on orientation change
	$(window).on('orientationchange', function() {
		if (modalActive == 1) {
			
			//repaint background

			setTimeout(function() {
				var top = document.documentElement.scrollTop || document.body.scrollTop;
				$modal.offset({top: top});

				// console.log('redrawn')
				// console.log('----------------------')
				// console.log('modal: ' + $modal.offset().top)
				// console.log('document: ' +  document.body.scrollTop)
				// console.log('----------------------')
			}, 20);			
		}
	});

	pixabayLookup();

}());