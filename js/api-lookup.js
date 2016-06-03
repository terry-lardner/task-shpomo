(function() {
	var $teasers = $('.teasers');
	var $teasersContainer = $('.teasers').find('.container');
	var $lookupError = $('.teasers').find('#lookupError');
	var template = $('.teasers').find('#pixabayTemplate').html();
	var $teaser;
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
					$teaser = $('.teasers').find('.teaser');

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
	}

	pixabayLookup();
}());