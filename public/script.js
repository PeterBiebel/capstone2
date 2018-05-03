console.log('clientSideJS')

$('.delete').click(function(){ 
	let id = $(this).parent().data('id');
	let p = $(this).parent()
	$.ajax({
	    url: '/delete-comment',
	    type: 'DELETE',
	    data:{ id : id},
	    success: function(result) {
	    	console.log(result)
	    	p.remove()
	    	//$('li').find(`[data-id='${id}']`).remove()
	        // Do something with the result
	    }
	});

	console.log('delete this comment', id)


 })
$('.up').click(function(){ 
	let id = $(this).parent().data('id');
	let p = $(this).parent()
	$.ajax({
	    url: '/like-comment',
	    type: 'PUT',
	    data:{ id : id},
	    success: function(result) {
	    	console.log(result)
	    	p.find('.likes').text(result.likes)
	    }
	});

})
$('.down').click(function(){ 
	let id = $(this).parent().data('id');
	let p = $(this).parent()
	$.ajax({
	    url: '/dislike-comment',
	    type: 'PUT',
	    data:{ id : id},
	    success: function(result) {
	    	p.find('.dislikes').text(result.dislikes)
	    	console.log(result)
	    	
	    }
	});

})
$('#emoji').click(function(e) {
	e.preventDefault()
	console.log('buttonhit')
	let value = $('input.emoji').val()
	console.log(value)
	$.ajax({
	    url: '/emoji',
	    type: 'POST',
	    data: {emoji: value},
	    success: function(result) {
	    	p.find('.emoji').val()
	    	console.log(result)
	    	
	    }
	})
 })










