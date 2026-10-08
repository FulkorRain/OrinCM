console.log("here");

function cameFromThisSite() {
    if (!document.referrer) return false;

    try {
        const referrerOrigin = new URL(document.referrer).origin;
        const sameSite = referrerOrigin === window.location.origin;
        return sameSite && window.history.length> 1;
    } catch (error) {
        return false;
    }
}

const backLink = document.getElementById("backLink");

if (backLink && cameFromThisSite()) {
    backLink.addEventListener("click",function(e) {
        e.preventDefault();
        window.history.back();
    })
}