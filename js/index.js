import jQuery from "jquery";
window.$ = window.jQuery = jQuery;


function resetQueryPosts(){
    let q = document.querySelector('#qposts').value;
    let posts = document.querySelectorAll('.Post');
        posts = Array.from(posts);

    if (q.length == 0) {
        jQuery('.noPost').addClass("hidden");
        jQuery('.Post').removeClass("hidden");
    }
    if (q && posts.length === document.querySelectorAll('.Post.hidden').length ) {
        jQuery('.noPost').removeClass("hidden");
    }
}

function browser_detect() {
    let br_size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (br_size <= 700) {
        window.location = "/mobile.html";
    }
    else {
        window.location = "/index.html";
    }
    console.log('browser_detect');
}

function init() {
    // Handler when the DOM is fully loaded
    console.log('facebook page test');

    window.onresize = browser_detect;


    jQuery('.btn').on('click', function(e){
        e.preventDefault();
        let el = $(this);
        let parent = el.parent('.btnwrapper');

        if (el.is('.pageLikeButton.selected')) {
            return false;
        }
        el.toggleClass('selected');
        if (parent) { parent.toggleClass('openToggler'); }
        if (el.is('.addPhoto')) {
            jQuery(el).siblings('.addPhotoInput').click();
        }
        return false;

    }).focusout(function() {
        let el = $(this);
        if (el.is('.likeButton') || el.is('.followButton')) return false;
        let parent = el.parent('.btnwrapper');
        el.removeClass('selected');
        if (parent.is('.openToggler')) {
            setTimeout( ()=> { parent.removeClass('openToggler'); }, 100);
        }
    });

    jQuery('#unlikeBtn').on('click', function(e){
        e.preventDefault();
        let el = jQuery('.likeButton.selected');
        let parent = el.parent('.btnwrapper');
        el.removeClass('selected');
        if (parent) { parent.removeClass('openToggler'); }
        return false;

    });

    jQuery('.postStatusBtn').on('click', function(e){
        e.preventDefault();
        let tab = jQuery(this).attr('data-tab');
        // console.log(tab);

        jQuery('.pSTab').removeClass('active');
        jQuery(`#tab-${tab}`).addClass('active');

        return false;
    });

    jQuery('.userMenu, .userSettings').find('a').on('click', function(e){
        e.preventDefault();
        let el = $(this);
        el.toggleClass('selected');
        let parent = el.parent('.btnwrapper');
        jQuery('.btnwrapper').removeClass('openToggler');
        if (parent) { parent.toggleClass('openToggler'); }

        return false;
    }).focusout(function() {
        let el = $(this);
        let parent = el.parent('.btnwrapper');
        el.removeClass('selected');
        if (parent.is('.openToggler')) {
            setTimeout( ()=> { parent.removeClass('openToggler'); }, 100);
        }
    });



    jQuery('.InputField').on('click', function(e) {
        // e.preventDefault();
        let el = jQuery(this);
        el.select();

        if (el.is('.InputFieldHeaderSearch')) {
            var s = el.parents('.searchBar');
            s.find('.searchResults').fadeIn('300');
        }

        // add new post
        if (el.is('#InputStatusPost')) {
            if (event.keyCode == 13){

                let postText = el.val();
                let posttemplate = `
                <div class="widgetWrapper Post" id="Post-0">
                    <div class="postHeader">
                        <a class="avatar" href="#" title="avatar">
                            <img src="./img/user-icon.png" alt="icon" />
                        </a>
                        <div class="postTitleContent">
                            <h3 class="postAuthor">Every Interaction</h3>
                            <span class="timestampContent">now</span>
                            <span class="bullet" role="presentation" aria-hidden="true"> · </span>
                            <a class="iconLink globe" aria-label="Public" href="#" role="button" data-tooltip-content="Public" >
                                <i class="icon smallglobe"></i>
                            </a>
                        </div>
                    </div>
                    <div class="postContent">
                        <h4 class="postContentTitle"> ${postText} </h4>
                    </div>
                </div>
                `.trim();
               // console.log(posttemplate);
                let posts = jQuery('#postList');

                posts.prepend(posttemplate);
                return false;
            }
        }

        return false;
    }).focusout(function() {
        jQuery('.searchResults').fadeOut('300');
    });

    jQuery('.postFooterLinks').find('button').on('click', function(e) {
        e.preventDefault();
        let el = jQuery(this);
        let postFooter = el.parents('.postFooter');
        if (el.is('.likePostButton')) {
            postFooter.find('.postLikes').toggleClass('hidden');
        }

        if (el.is('.commentButton')) {
            postFooter.find('.postComment').show();
            postFooter.find('input.InputComment').focus();

        }

        return false;

    });

    jQuery('#qposts').on('keyup', function(e) {
        let el = jQuery(this);
        let posts = document.querySelectorAll('.Post');
        posts = Array.from(posts);
        let q = document.querySelector('#qposts').value;
        // console.log('query =', q);
        jQuery('.noPost').addClass("hidden");

        setTimeout(() => {
            posts.forEach ( e => {
                e.classList.add("hidden");
                if(q && e.querySelector('h4').textContent.trim().toLowerCase().indexOf(q) > -1 )
                {
                    e.classList.remove("hidden");
                }
                else {
                    document.querySelector('.noPost').classList.toggle('hidden');
                }
            });

            resetQueryPosts();

        }, 500);

    })
    .focusout(function() {
        resetQueryPosts();
    });

    jQuery('input.InputComment').on('keypress', function(e){
         let el = jQuery(this);
         let comm_list = el.parents('.postComment').find('.postCommentsList');

        if (event.keyCode == 13){
            let comment = `
            <div class="SingleComment postCommentInputWrapper">
                <a class="avatar userIcon" href="#" title="avatar">&nbsp;</a>
                <div class="NewComment">${e.target.value}</div>
            </div>`;
            comment = comment.trim();

            if (comm_list) {
                comm_list.removeClass('hidden');
                comm_list.append(comment);
            }

            return false; // returning false will prevent the event from bubbling up.
        }
    });

    jQuery('a[href="#"], a[href=""]').on('click', function(e){
        e.preventDefault();
        // console.log(e.target);
        return false;
    });


};

if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    browser_detect();
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}