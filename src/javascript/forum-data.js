// EDITABLE
// This is where all of the data for all the threads live.
// Let me know if you want me to break it down
const FORUMS = [

  // ── 1. ANNOUNCEMENTS ──────────────────────────────────────
  {
    id: "announcements",
    name: "Hot Bytes",
    description: "Kindly review the Forum rules before posting.",
    threads: [
      {
        id: "welcome-to-bulletin-bytes",
        title: "Weird Mall Ads",
        author: "Butterfly♡Kisser",
        posts: 7,
        views: 212,
        lastPost: "1999-12-04",
        type: "thread",
        content: [
          {
            author: "Butterfly♡Kisser",
            userTitle: "Lurker",
            joinDate: "Nov 1998",
            postCount: 4,
            location: "The Internet",
            avatar: "https://placehold.co/80x80",
            signature: "Pretty High (for a Butterfly)",
            text: `Does anyone remember those weird ads for that mall in Alberta? I forgot the name but always found the ads so odd lol like they kinda gave me a funny feeling whenever they came on. Does anyone else remember this?`
          },
             {
            author: "de0rdra",
            userTitle: "Lurker",
            joinDate: "Mar 1999",
            postCount: 16,
            location: "Nice try",
            avatar: "https://placehold.co/80x80",
            signature: "...",
            text: `Blast from the past lol, yeah super weird vibe I don’t know the name either but I remember what you’re talking about. MINI GOOOLF`
          },
             {
            author: "Cringe_Lizard",
            userTitle: "Admin",
            joinDate: "Jun 1998",
            postCount: 87,
            location: "Montana",
            avatar: "https://placehold.co/80x80",
            signature: "Hangin' loose.",
            text: `I believe you mean Myriad Mall which was being built in Hartsorn Creek Alberta. It did not get finished, for obvious reasons. Kinda sad because from the photos we do have it looks pretty sick lol`
          },
             {
            author: "Butterfly♡Kisser",
            userTitle: "Lurker",
            joinDate: "Nov 1998",
            postCount: 4,
            location: "The Internet",
            avatar: "https://placehold.co/80x80",
            signature: "Pretty High (for a Butterfly)",
            text: `Yes that’s the one! Amazing!`
          },
             {
            author: "omelio",
            userTitle: "Poster Boy",
            joinDate: "Feb 1998",
            postCount: 108,
            location: "Spain",
            avatar: "https://placehold.co/80x80",
            signature: "How do you like your eggs?",
            text: `Here’s some more info on it if you are curious. I agree it is too bad they couldn’t finish.[hyperlink to hidden news article]`
          },
             {
            author: "gherKen",
            userTitle: "Lurker",
            joinDate: "Apr 1998",
            postCount: 33,
            location: "Brine",
            avatar: "https://placehold.co/80x80",
            signature: "Feelin fine",
            text: `I remember reading something that the main architect was like a total freak and delayed the construction a bunch with unreasonable demands and whatnot, so maybe wouled never have opened anyway…`
          },
             {
            author: "mike83",
            userTitle: "Poster Boy",
            joinDate: "Jan 1999",
            postCount: 148,
            location: "Alberta",
            avatar: "https://placehold.co/80x80",
            signature: "IT Professional",
            text: `Yo man I remember these too! I always thought the popcorn one was so weird like I don’t need to drive three hours to some hick town for popcorn lol we have plenty of that here in civilization.`
          }
        ]
      },
      {
        id: "rules-read-first",
        title: "Worried about Y2K?",
        author: "i_wok_alone",
        posts: 10,
        views: 489,
        lastPost: "1999-11-17",
        type: "thread",
        content: [
          {
            author: "i_wok_alone",
            userTitle: "Lurker",
            joinDate: "May 1999",
            postCount: 63,
            location: "Illinois",
            avatar: "https://placehold.co/80x80",
            signature: "We are ☆star-stuff☆",
            text: `Do you think this is all overblown? I get the basic idea off two many chars in the Date and a text overflow error but don’t understand why would that be such a big deal?`
          },
          {
            author: "jim1972",
            userTitle: "Lurker",
            joinDate: "Aug 1999",
            postCount: 3,
            location: "Florida",
            avatar: "https://placehold.co/80x80",
            signature: "Roush 5-car",
            text: `We will be abkle to deal with it but consequences would be pretty bnd if we didn’t lol`
          },
          {
            author: "Barfolomew",
            userTitle: "Lurker",
            joinDate: "May 1998",
            postCount: 89,
            location: "The Web",
            avatar: "https://placehold.co/80x80",
            signature: "There goes the neighborhood.",
            text: `Basically you need to go into the source code on every device and update so there’s enough space for the date change or at least change the way the date updates`
          },
          {
            author: "Tears_in_the_Brain",
            userTitle: "Lurker",
            joinDate: "Sep 1999",
            postCount: 9,
            location: "Manitoba",
            avatar: "https://placehold.co/80x80",
            signature: "Nü metal 4 lyfe",
            text: `Couldn’t they send some kind of update like you said but wirelessly somehow, like beam it into all the computers instead of going door to door?`
          },
          {
            author: "Barfolomew",
            userTitle: "Lurker",
            joinDate: "May 1998",
            postCount: 89,
            location: "The Web",
            avatar: "https://placehold.co/80x80",
            signature: "There goes the neighborhood.",
            text: `Sure wireless beaming. That might be the dumbest thing I have ever read on this site and that is saying something (¬_¬)`
          },
          {
            author: "❀Rosicrucian❊Druid⏾࣪",
            userTitle: "Poster Boy",
            joinDate: "Dec 1997",
            postCount: 513,
            location: "Starship Earth",
            avatar: "https://placehold.co/80x80",
            signature: "Night of Pan[link to this diary]",
            text: `The Millennium will be a time of great transformation! Echoes of our past lives will be reaching out at this time to help align human consciousness towards a more harmonious future.`
          },
          {
            author: "TruthWolf23",
            userTitle: "Poster Boy",
            joinDate: "Nov 1997",
            postCount: 744,
            location: "SOVEREIGN",
            avatar: "https://placehold.co/80x80",
            signature: "The Irreplaceable Spark[link to this diary]",
            text: `Or just maybe they are using the Y2K SCAM to control YOUR life? Couldn’t be that, must be a bunch of hippy shit…`
          },
          {
            author: "❀Rosicrucian❊Druid⏾࣪",
            userTitle: "Poster Boy",
            joinDate: "Dec 1997",
            postCount: 513,
            location: "Starship Earth",
            avatar: "https://placehold.co/80x80",
            signature: "Night of Pan[link to this diary]",
            text: `You are stuck in the old paradigms. We don’t need to worry about all these petty political arguments when the future is so much bigger than politics. Join with me, for my party and project is the HUMAN project!`
          },
          {
            author: "TruthWolf23",
            userTitle: "Poster Boy",
            joinDate: "Nov 1997",
            postCount: 744,
            location: "SOVEREIGN",
            avatar: "https://placehold.co/80x80",
            signature: "The Irreplaceable Spark[link to this diary]",
            text: `How about you put down the reefer for ONE SECOND and OPEN your EYES. You think all they want with your computer is to ADD an extra DIGIT in the SOURCE CODE? If your brain isn’t completely cooked from Pynchon and Microdots you need to WAKE UP!`
          },
          {
            author: "Potemkin_prince",
            userTitle: "Admin",
            joinDate: "Oct 1998",
            postCount: 277,
            location: "Right here, right now",
            avatar: "https://placehold.co/80x80",
            signature: "Praise loudly, blame quietly.",
            text: `This thread has been locked by the moderator. Please review our forum rules and keep things civil.
Yes, you. If you want to keep your account don’t make me explain this again.`
          }
        ]
      },
      {
        id: "forum-upgrade-notice",
        title: "Forum upgraded to TotallyNotvBulletin 1.0",
        author: "CoolGuy2004",
        date: "2004-06-10",
        displayDate: "06-10-2004",
        posts: 3,
        views: 88,
        lastPost: "2004-06-11 14:02",
        type: "thread",
        content: [
          {
            author: "CoolGuy2004",
            userTitle: "Admin",
            joinDate: "Jun 2004",
            postCount: 1,
            location: "The Internet",
            avatar: "https://placehold.co/80x80",
            date: "06-10-2004, 11:00 AM",
            signature: "Windows XP Professional User",
            text: `just upgraded the forum software. let me know if anything is broken<br><br>
                   also the new avatars should work now. max size is 80x80`
          },
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-11-2004, 09:42 AM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `my avatar still doesnt work<br><br>
                   also the theme looks different did u change something`
          },
          {
            author: "CoolGuy2004",
            userTitle: "Admin",
            joinDate: "Jun 2004",
            postCount: 1,
            location: "The Internet",
            avatar: "https://placehold.co/80x80",
            date: "06-11-2004, 14:02 PM",
            signature: "Windows XP Professional User",
            text: `clear ur cache dude<br><br>
                   ctrl+f5`
          }
        ]
      },
      {
        id: "404-page",
        title: "New merch in the store!!",
        author: "CoolGuy2004",
        date: "2004-06-12",
        displayDate: "06-12-2004",
        posts: 1,
        views: 145,
        lastPost: "2004-06-12 10:00",
        type: "redirect",
        // TODO: change the redirect
        redirect: "#",
        placeholder: true
      },
      {
        id: "404-page",
        title: "Sign up for the mailing list and get updates!!",
        author: "CoolGuy2004",
        date: "2004-06-12",
        displayDate: "06-12-2004",
        posts: 1,
        views: 98,
        lastPost: "2004-06-12 10:05",
        // TODO: Change redirect
        type: "redirect",
        redirect: "#",
        placeholder: true
      }
    ]
  },

  {
    id: "general-discussion",
    name: "General Discussion",
    description: "Talk about whatever. Keep it clean.",
    threads: [
      {
        id: "what-are-you-listening-to",
        title: "what are you listening to right now",
        author: "xXShadowKnightXx",
        date: "2004-06-02",
        displayDate: "06-02-2004",
        posts: 14,
        views: 302,
        lastPost: "2004-06-12 11:45",
        type: "thread",
        content: [
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-02-2004, 03:14 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `linkin park - meteora<br><br>
                   on repeat since tuesday. no regrets`
          },
          {
            author: "PrairieGhost",
            userTitle: "lurker",
            joinDate: "Jun 2004",
            postCount: 7,
            location: "Saskatchewan",
            avatar: "https://placehold.co/80x80",
            date: "06-02-2004, 04:22 PM",
            signature: "",
            text: `modest mouse - good news for people who love bad news<br><br>
                   floats and the dead are good tracks`
          },
          {
            author: "GlennFromAccounting",
            userTitle: "senior member",
            joinDate: "Apr 2004",
            postCount: 412,
            location: "Manitoba",
            avatar: "https://placehold.co/80x80",
            date: "06-03-2004, 08:55 AM",
            signature: "My other computer is also a Dell",
            text: `classic rock. always classic rock.<br><br>
                   you kids and your linkin park lol`
          }
        ]
      },
      {
        id: "anyone-seen-shrek-2",
        title: "anyone seen shrek 2 yet",
        author: "PrairieGhost",
        date: "2004-06-04",
        displayDate: "06-04-2004",
        posts: 9,
        views: 188,
        lastPost: "2004-06-08 19:30",
        type: "thread",
        content: [
          {
            author: "PrairieGhost",
            userTitle: "lurker",
            joinDate: "Jun 2004",
            postCount: 7,
            location: "Saskatchewan",
            avatar: "https://placehold.co/80x80",
            date: "06-04-2004, 07:10 PM",
            signature: "",
            text: `saw it last night<br><br>
                   puss in boots is the funniest character in any movie ever. i said what i said`
          },
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-05-2004, 10:02 AM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `havent seen it yet my mom wont take me<br><br>
                   is it better than the first one`
          },
          {
            author: "PrairieGhost",
            userTitle: "lurker",
            joinDate: "Jun 2004",
            postCount: 7,
            location: "Saskatchewan",
            avatar: "https://placehold.co/80x80",
            date: "06-05-2004, 03:45 PM",
            signature: "",
            text: `yes. not even close`
          }
        ]
      },
      {
        id: "dial-up-vs-broadband",
        title: "dial up vs broadband - is it even worth switching",
        author: "GlennFromAccounting",
        date: "2004-06-05",
        displayDate: "06-05-2004",
        posts: 21,
        views: 519,
        lastPost: "2004-06-11 20:14",
        type: "thread",
        content: [
          {
            author: "GlennFromAccounting",
            userTitle: "senior member",
            joinDate: "Apr 2004",
            postCount: 412,
            location: "Manitoba",
            avatar: "https://placehold.co/80x80",
            date: "06-05-2004, 09:00 AM",
            signature: "My other computer is also a Dell",
            text: `my ISP keeps calling me to upgrade to broadband<br><br>
                   is it actually worth the extra $30 a month or is it a scam<br><br>
                   i mostly just use the internet for email and forums tbh`
          },
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-05-2004, 03:31 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `dude YES switch immediately<br><br>
                   i can download a whole song in like 2 minutes now<br><br>
                   no more tying up the phone line either`
          },
          {
            author: "GlennFromAccounting",
            userTitle: "senior member",
            joinDate: "Apr 2004",
            postCount: 412,
            location: "Manitoba",
            avatar: "https://placehold.co/80x80",
            date: "06-06-2004, 08:10 AM",
            signature: "My other computer is also a Dell",
            text: `what do you even download that takes that long<br><br>
                   i dont want to know actually`
          }
        ]
      },
      {
        id: "post-your-desktop",
        title: "post your desktop screenshot",
        author: "xXShadowKnightXx",
        date: "2004-06-07",
        displayDate: "06-07-2004",
        posts: 17,
        views: 430,
        lastPost: "2004-06-12 09:00",
        type: "thread",
        content: [
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-07-2004, 05:55 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `lets see everyones desktops<br><br>
                   mine has the halo wallpaper from the xbox site<br><br>
                   [img]broken_image_link.jpg[/img]`
          },
          {
            author: "PrairieGhost",
            userTitle: "lurker",
            joinDate: "Jun 2004",
            postCount: 7,
            location: "Saskatchewan",
            avatar: "https://placehold.co/80x80",
            date: "06-08-2004, 12:13 PM",
            signature: "",
            text: `mine is just the windows xp bliss wallpaper<br><br>
                   i know i know. i haven't gotten around to changing it`
          }
        ]
      },
      {
        id: "summer-plans",
        title: "what are everyone's summer plans",
        author: "PrairieGhost",
        date: "2004-06-09",
        displayDate: "06-09-2004",
        posts: 6,
        views: 112,
        lastPost: "2004-06-10 16:40",
        type: "thread",
        content: [
          {
            author: "PrairieGhost",
            userTitle: "lurker",
            joinDate: "Jun 2004",
            postCount: 7,
            location: "Saskatchewan",
            avatar: "https://placehold.co/80x80",
            date: "06-09-2004, 06:00 PM",
            signature: "",
            text: `school just ended for me<br><br>
                   probably just gonna be on here and play games all summer tbh<br><br>
                   maybe get a job at the gas station if i have to`
          },
          {
            author: "GlennFromAccounting",
            userTitle: "senior member",
            joinDate: "Apr 2004",
            postCount: 412,
            location: "Manitoba",
            avatar: "https://placehold.co/80x80",
            date: "06-10-2004, 08:30 AM",
            signature: "My other computer is also a Dell",
            text: `camping in august<br><br>
                   wife is already planning the whole thing. i just show up lol`
          }
        ]
      }
    ]
  },

  {
    id: "introductions",
    name: "Introductions",
    description: "New here? Say hi. We don't bite. Usually.",
    threads: [
      {
        id: "hi-im-new",
        title: "hi im new here",
        author: "PrairieGhost",
        date: "2004-06-03",
        displayDate: "06-03-2004",
        posts: 5,
        views: 77,
        lastPost: "2004-06-03 18:00",
        type: "thread",
        content: [
          {
            author: "PrairieGhost",
            userTitle: "lurker",
            joinDate: "Jun 2004",
            postCount: 7,
            location: "Saskatchewan",
            avatar: "https://placehold.co/80x80",
            date: "06-03-2004, 02:00 PM",
            signature: "",
            text: `hey found this forum through google<br><br>
                   been reading prairie golem press comics for a while now<br><br>
                   cool to see theres a forum. hope it gets more active`
          },
          {
            author: "CoolGuy2004",
            userTitle: "Admin",
            joinDate: "Jun 2004",
            postCount: 1,
            location: "The Internet",
            avatar: "https://placehold.co/80x80",
            date: "06-03-2004, 02:45 PM",
            signature: "Windows XP Professional User",
            text: `welcome!! glad you found us<br><br>
                   tell ur friends lol we need more people`
          },
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-03-2004, 06:00 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `hey welcome<br><br>
                   do you play runescape`
          }
        ]
      },
      {
        id: "greetings-from-manitoba",
        title: "Greetings from Manitoba",
        author: "GlennFromAccounting",
        date: "2004-04-14",
        displayDate: "04-14-2004",
        posts: 4,
        views: 55,
        lastPost: "2004-04-15 11:20",
        type: "thread",
        content: [
          {
            author: "GlennFromAccounting",
            userTitle: "senior member",
            joinDate: "Apr 2004",
            postCount: 412,
            location: "Manitoba",
            avatar: "https://placehold.co/80x80",
            date: "04-14-2004, 10:00 AM",
            signature: "My other computer is also a Dell",
            text: `hello everyone<br><br>
                   my nephew showed me this site. i don't usually do forums but here i am<br><br>
                   big fan of the comics. the clay golem stuff reminds me of the prairies i grew up on`
          },
          {
            author: "CoolGuy2004",
            userTitle: "Admin",
            joinDate: "Jun 2004",
            postCount: 1,
            location: "The Internet",
            avatar: "https://placehold.co/80x80",
            date: "04-14-2004, 11:20 AM",
            signature: "Windows XP Professional User",
            text: `welcome glenn!! always good to have older fans on here<br><br>
                   no offense lol`
          }
        ]
      },
      {
        id: "shadowknight-intro",
        title: "sup everyone its me shadowknight",
        author: "xXShadowKnightXx",
        date: "2004-05-02",
        displayDate: "05-02-2004",
        posts: 3,
        views: 91,
        lastPost: "2004-05-02 20:10",
        type: "thread",
        content: [
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "05-02-2004, 07:30 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `hey whats up<br><br>
                   i'm 14 and i like video games and drawing<br><br>
                   my friend told me about this comic and its actually pretty cool<br><br>
                   add me on aim if u want: shadowknight420`
          },
          {
            author: "CoolGuy2004",
            userTitle: "Admin",
            joinDate: "Jun 2004",
            postCount: 1,
            location: "The Internet",
            avatar: "https://placehold.co/80x80",
            date: "05-02-2004, 08:00 PM",
            signature: "Windows XP Professional User",
            text: `welcome dude<br><br>
                   dont post ur aim in public next time though lol`
          }
        ]
      },
      {
        id: "hello-from-lurker",
        title: "been lurking for weeks finally made an account",
        author: "DustBunny99",
        date: "2004-06-11",
        displayDate: "06-11-2004",
        posts: 2,
        views: 34,
        lastPost: "2004-06-11 22:00",
        type: "thread",
        content: [
          {
            author: "DustBunny99",
            userTitle: "new member",
            joinDate: "Jun 2004",
            postCount: 1,
            location: "Alberta",
            avatar: "https://placehold.co/80x80",
            date: "06-11-2004, 09:44 PM",
            signature: "",
            text: `ok i finally made an account after like a month of reading threads<br><br>
                   hi everyone<br><br>
                   idk what else to say. i like the comics and this forum seems chill`
          },
          {
            author: "PrairieGhost",
            userTitle: "lurker",
            joinDate: "Jun 2004",
            postCount: 7,
            location: "Saskatchewan",
            avatar: "https://placehold.co/80x80",
            date: "06-11-2004, 10:00 PM",
            signature: "",
            text: `welcome!! fellow lurker solidarity`
          }
        ]
      },
      {
        id: "new-from-bc",
        title: "new here - came from a webcomic recommendation thread on another forum",
        author: "VancouverVince",
        date: "2004-06-12",
        displayDate: "06-12-2004",
        posts: 1,
        views: 12,
        lastPost: "2004-06-12 14:05",
        type: "thread",
        content: [
          {
            author: "VancouverVince",
            userTitle: "new member",
            joinDate: "Jun 2004",
            postCount: 1,
            location: "Vancouver BC",
            avatar: "https://placehold.co/80x80",
            date: "06-12-2004, 02:05 PM",
            signature: "",
            text: `hey all<br><br>
                   saw prairie golem press recommended on another forum and spent the whole afternoon reading<br><br>
                   the art style is like nothing else. joined to say so`
          }
        ]
      }
    ]
  },

  {
    id: "off-topic",
    name: "Off Topic",
    description: "Nothing to do with comics. Everything else goes here.",
    threads: [
      {
        id: "runescape-anyone",
        title: "anyone here play runescape",
        author: "xXShadowKnightXx",
        date: "2004-06-02",
        displayDate: "06-02-2004",
        posts: 11,
        views: 267,
        lastPost: "2004-06-09 21:00",
        type: "thread",
        content: [
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-02-2004, 06:00 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `anyone here play runescape<br><br>
                   my combat level is 67 and i'm trying to get 70 before school starts again<br><br>
                   add me: shadowknight420`
          },
          {
            author: "PrairieGhost",
            userTitle: "lurker",
            joinDate: "Jun 2004",
            postCount: 7,
            location: "Saskatchewan",
            avatar: "https://placehold.co/80x80",
            date: "06-03-2004, 01:15 PM",
            signature: "",
            text: `i tried it but my dial up makes it unplayable<br><br>
                   by the time i load in im already dead`
          },
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-03-2004, 05:00 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `get broadband bro<br><br>
                   its worth it just for runescape alone`
          }
        ]
      },
      {
        id: "internet-explorer-vs-firefox",
        title: "internet explorer vs firefox - settle this once and for all",
        author: "GlennFromAccounting",
        date: "2004-06-06",
        displayDate: "06-06-2004",
        posts: 28,
        views: 601,
        lastPost: "2004-06-12 08:00",
        type: "thread",
        content: [
          {
            author: "GlennFromAccounting",
            userTitle: "senior member",
            joinDate: "Apr 2004",
            postCount: 412,
            location: "Manitoba",
            avatar: "https://placehold.co/80x80",
            date: "06-06-2004, 10:00 AM",
            signature: "My other computer is also a Dell",
            text: `my nephew keeps telling me to switch to firefox<br><br>
                   but i've always used internet explorer and it works fine<br><br>
                   what's everyone's take`
          },
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-06-2004, 04:15 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `firefox 1000%<br><br>
                   tabbed browsing changes everything<br><br>
                   IE is basically a virus delivery system at this point`
          },
          {
            author: "GlennFromAccounting",
            userTitle: "senior member",
            joinDate: "Apr 2004",
            postCount: 412,
            location: "Manitoba",
            avatar: "https://placehold.co/80x80",
            date: "06-07-2004, 09:00 AM",
            signature: "My other computer is also a Dell",
            text: `what are tabs<br><br>
                   like browser tabs? i just open a new window`
          },
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-07-2004, 03:45 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `ok i'm downloading firefox for you right now<br><br>
                   i'll walk you through it on aim`
          }
        ]
      },
      {
        id: "worst-chain-emails",
        title: "post the worst chain email you've received",
        author: "DustBunny99",
        date: "2004-06-11",
        displayDate: "06-11-2004",
        posts: 8,
        views: 199,
        lastPost: "2004-06-12 10:30",
        type: "thread",
        content: [
          {
            author: "DustBunny99",
            userTitle: "new member",
            joinDate: "Jun 2004",
            postCount: 1,
            location: "Alberta",
            avatar: "https://placehold.co/80x80",
            date: "06-11-2004, 08:00 PM",
            signature: "",
            text: `my aunt sends me like 5 a day<br><br>
                   today i got one that said bill gates will send me $1000 if i forward this to 100 people<br><br>
                   she genuinely believes it`
          },
          {
            author: "GlennFromAccounting",
            userTitle: "senior member",
            joinDate: "Apr 2004",
            postCount: 412,
            location: "Manitoba",
            avatar: "https://placehold.co/80x80",
            date: "06-11-2004, 09:00 PM",
            signature: "My other computer is also a Dell",
            text: `i got one last week that said if i didn't forward it i'd have bad luck for 7 years<br><br>
                   deleted it immediately. nothing happened. do not @ me`
          }
        ]
      },
      {
        id: "y2k-was-nothing",
        title: "remember when everyone freaked out about y2k lol",
        author: "GlennFromAccounting",
        date: "2004-06-08",
        displayDate: "06-08-2004",
        posts: 12,
        views: 344,
        lastPost: "2004-06-10 14:00",
        type: "thread",
        content: [
          {
            author: "GlennFromAccounting",
            userTitle: "senior member",
            joinDate: "Apr 2004",
            postCount: 412,
            location: "Manitoba",
            avatar: "https://placehold.co/80x80",
            date: "06-08-2004, 11:30 AM",
            signature: "My other computer is also a Dell",
            text: `was cleaning out my garage and found a y2k survival kit i never opened<br><br>
                   still has canned beans and a hand crank radio in it<br><br>
                   who else panicked for nothing`
          },
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-08-2004, 04:00 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `i was like 10 and my parents made me go to bed at 10pm so i missed the whole thing<br><br>
                   woke up and the power was still on and i was so disappointed`
          }
        ]
      },
      {
        id: "funniest-aim-away-messages",
        title: "post your best AIM away messages",
        author: "xXShadowKnightXx",
        date: "2004-06-10",
        displayDate: "06-10-2004",
        posts: 19,
        views: 487,
        lastPost: "2004-06-12 13:00",
        type: "thread",
        content: [
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-10-2004, 05:00 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `mine right now is:<br><br>
                   <i>~*~ not here ~*~ leave a message ~*~ maybe ill respond ~*~</i><br><br>
                   what are yours`
          },
          {
            author: "PrairieGhost",
            userTitle: "lurker",
            joinDate: "Jun 2004",
            postCount: 7,
            location: "Saskatchewan",
            avatar: "https://placehold.co/80x80",
            date: "06-10-2004, 07:22 PM",
            signature: "",
            text: `mine is just song lyrics nobody recognizes<br><br>
                   very mysterious. very cool`
          },
          {
            author: "DustBunny99",
            userTitle: "new member",
            joinDate: "Jun 2004",
            postCount: 1,
            location: "Alberta",
            avatar: "https://placehold.co/80x80",
            date: "06-10-2004, 09:00 PM",
            signature: "",
            text: `"sleeping // bbl" and i've had it for like 8 months<br><br>
                   i am never sleeping. i am always on here`
          }
        ]
      }
    ]
  },

  {
    id: "tech-support",
    name: "Tech Support",
    description: "Computer broken? Post here. Glenn will probably make it worse.",
    threads: [
      {
        id: "computer-running-slow",
        title: "my computer is running really slow what do i do",
        author: "PrairieGhost",
        date: "2004-06-04",
        displayDate: "06-04-2004",
        posts: 7,
        views: 203,
        lastPost: "2004-06-05 15:30",
        type: "thread",
        content: [
          {
            author: "PrairieGhost",
            userTitle: "lurker",
            joinDate: "Jun 2004",
            postCount: 7,
            location: "Saskatchewan",
            avatar: "https://placehold.co/80x80",
            date: "06-04-2004, 04:00 PM",
            signature: "",
            text: `my pc is taking like 10 minutes to boot up<br><br>
                   it was fine last month<br><br>
                   specs: windows xp, pentium 4, 256mb ram`
          },
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-04-2004, 06:22 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `probably spyware<br><br>
                   download ad-aware and scan it<br><br>
                   also check how many things are in your startup folder`
          },
          {
            author: "GlennFromAccounting",
            userTitle: "senior member",
            joinDate: "Apr 2004",
            postCount: 412,
            location: "Manitoba",
            avatar: "https://placehold.co/80x80",
            date: "06-05-2004, 09:00 AM",
            signature: "My other computer is also a Dell",
            text: `have you tried turning it off and on again<br><br>
                   worked for my printer`
          }
        ]
      },
      {
        id: "kazaa-virus",
        title: "i think i got a virus from kazaa - help",
        author: "DustBunny99",
        date: "2004-06-09",
        displayDate: "06-09-2004",
        posts: 15,
        views: 388,
        lastPost: "2004-06-11 18:00",
        type: "thread",
        content: [
          {
            author: "DustBunny99",
            userTitle: "new member",
            joinDate: "Jun 2004",
            postCount: 1,
            location: "Alberta",
            avatar: "https://placehold.co/80x80",
            date: "06-09-2004, 08:00 PM",
            signature: "",
            text: `ok so i was downloading something and now my browser keeps opening random websites<br><br>
                   also theres a new toolbar i didn't install<br><br>
                   please help i can't tell my parents`
          },
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-09-2004, 09:15 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `lmao kazaa<br><br>
                   download hijackthis and post the log here<br><br>
                   also stop using kazaa. use limewire`
          },
          {
            author: "GlennFromAccounting",
            userTitle: "senior member",
            joinDate: "Apr 2004",
            postCount: 412,
            location: "Manitoba",
            avatar: "https://placehold.co/80x80",
            date: "06-10-2004, 08:30 AM",
            signature: "My other computer is also a Dell",
            text: `what is kazaa<br><br>
                   actually don't tell me`
          }
        ]
      },
      {
        id: "winamp-skins",
        title: "best winamp skins - post em",
        author: "xXShadowKnightXx",
        date: "2004-06-03",
        displayDate: "06-03-2004",
        posts: 22,
        views: 556,
        lastPost: "2004-06-12 07:45",
        type: "thread",
        content: [
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-03-2004, 07:00 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `winamp skin thread. post your favourites<br><br>
                   mine is this dark metal one i found on deviantart<br><br>
                   whips it into shape whips it good`
          },
          {
            author: "PrairieGhost",
            userTitle: "lurker",
            joinDate: "Jun 2004",
            postCount: 7,
            location: "Saskatchewan",
            avatar: "https://placehold.co/80x80",
            date: "06-04-2004, 02:00 PM",
            signature: "",
            text: `i use the default one<br><br>
                   before anyone says anything: i know`
          }
        ]
      },
      {
        id: "printer-not-working",
        title: "printer says offline but its clearly on - SOLVED",
        author: "GlennFromAccounting",
        date: "2004-06-07",
        displayDate: "06-07-2004",
        posts: 6,
        views: 177,
        lastPost: "2004-06-07 17:00",
        type: "thread",
        content: [
          {
            author: "GlennFromAccounting",
            userTitle: "senior member",
            joinDate: "Apr 2004",
            postCount: 412,
            location: "Manitoba",
            avatar: "https://placehold.co/80x80",
            date: "06-07-2004, 02:00 PM",
            signature: "My other computer is also a Dell",
            text: `printer keeps saying offline even though it is plugged in and on<br><br>
                   tried restarting. still offline<br><br>
                   hp deskjet 3745`
          },
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-07-2004, 03:30 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `go to printers and faxes → right click → uncheck "use printer offline"<br><br>
                   classic hp moment`
          },
          {
            author: "GlennFromAccounting",
            userTitle: "senior member",
            joinDate: "Apr 2004",
            postCount: 412,
            location: "Manitoba",
            avatar: "https://placehold.co/80x80",
            date: "06-07-2004, 05:00 PM",
            signature: "My other computer is also a Dell",
            text: `that fixed it<br><br>
                   why would you ever want to use a printer offline<br><br>
                   it doesn't make any sense`
          }
        ]
      },
      {
        id: "cd-burner-recommendation",
        title: "cd burner recommendations - need one under $80",
        author: "PrairieGhost",
        date: "2004-06-10",
        displayDate: "06-10-2004",
        posts: 9,
        views: 241,
        lastPost: "2004-06-11 12:00",
        type: "thread",
        content: [
          {
            author: "PrairieGhost",
            userTitle: "lurker",
            joinDate: "Jun 2004",
            postCount: 7,
            location: "Saskatchewan",
            avatar: "https://placehold.co/80x80",
            date: "06-10-2004, 01:00 PM",
            signature: "",
            text: `looking to get a cd burner so i can make mixtapes for my car<br><br>
                   budget is like $80 canadian<br><br>
                   anyone have a good one`
          },
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-10-2004, 04:00 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `lite-on makes good cheap ones<br><br>
                   also get nero burning rom for the software. way better than windows`
          }
        ]
      }
    ]
  },

  {
    id: "trading-post",
    name: "Trading Post",
    description: "Buy, sell, trade. No scammers. Glenn is watching.",
    threads: [
      {
        id: "selling-old-comics",
        title: "selling some old comics - make an offer",
        author: "GlennFromAccounting",
        date: "2004-06-08",
        displayDate: "06-08-2004",
        posts: 5,
        views: 134,
        lastPost: "2004-06-10 13:00",
        type: "thread",
        content: [
          {
            author: "GlennFromAccounting",
            userTitle: "senior member",
            joinDate: "Apr 2004",
            postCount: 412,
            location: "Manitoba",
            avatar: "https://placehold.co/80x80",
            date: "06-08-2004, 03:00 PM",
            signature: "My other computer is also a Dell",
            text: `cleaning out the basement. have a bunch of comics from the 80s and 90s<br><br>
                   nothing crazy valuable. some marvels, some dc, some independents<br><br>
                   make an offer. will ship to canada only`
          },
          {
            author: "PrairieGhost",
            userTitle: "lurker",
            joinDate: "Jun 2004",
            postCount: 7,
            location: "Saskatchewan",
            avatar: "https://placehold.co/80x80",
            date: "06-09-2004, 12:00 PM",
            signature: "",
            text: `do you have any of the early indie prairie stuff from the 90s<br><br>
                   small press runs etc`
          }
        ]
      },
      {
        id: "wtb-gameboy-games",
        title: "WTB: gameboy advance games",
        author: "xXShadowKnightXx",
        date: "2004-06-09",
        displayDate: "06-09-2004",
        posts: 4,
        views: 88,
        lastPost: "2004-06-10 20:00",
        type: "thread",
        content: [
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-09-2004, 06:00 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `looking for gba games<br><br>
                   specifically want: golden sun, fire emblem, mother 3 if anyone has it<br><br>
                   msg me on aim`
          },
          {
            author: "DustBunny99",
            userTitle: "new member",
            joinDate: "Jun 2004",
            postCount: 1,
            location: "Alberta",
            avatar: "https://placehold.co/80x80",
            date: "06-10-2004, 08:00 PM",
            signature: "",
            text: `i have golden sun but i'm not done with it yet<br><br>
                   maybe in a few weeks`
          }
        ]
      },
      {
        id: "404-page",
        title: "can you buy prairie golem press stuff anywhere online",
        author: "VancouverVince",
        date: "2004-06-12",
        displayDate: "06-12-2004",
        posts: 2,
        views: 41,
        lastPost: "2004-06-12 14:30",
        // TODO: change the redirect
        type: "redirect",
        redirect: "#",
        placeholder: true
      },
      {
        id: "free-stuff-giveaway",
        title: "giving away some zines - first come first served",
        author: "PrairieGhost",
        date: "2004-06-11",
        displayDate: "06-11-2004",
        posts: 8,
        views: 192,
        lastPost: "2004-06-12 11:00",
        type: "thread",
        content: [
          {
            author: "PrairieGhost",
            userTitle: "lurker",
            joinDate: "Jun 2004",
            postCount: 7,
            location: "Saskatchewan",
            avatar: "https://placehold.co/80x80",
            date: "06-11-2004, 11:00 AM",
            signature: "",
            text: `have some zines i've doubled up on<br><br>
                   first 3 people to msg me get them free. just pay shipping<br><br>
                   mix of mini comics and music zines from the past year`
          },
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-11-2004, 03:00 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `aim'd you<br><br>
                   dibs`
          }
        ]
      },
      {
        id: "iso-scanner",
        title: "ISO: flatbed scanner - doesn't have to be new",
        author: "DustBunny99",
        date: "2004-06-12",
        displayDate: "06-12-2004",
        posts: 1,
        views: 18,
        lastPost: "2004-06-12 13:45",
        type: "thread",
        content: [
          {
            author: "DustBunny99",
            userTitle: "new member",
            joinDate: "Jun 2004",
            postCount: 1,
            location: "Alberta",
            avatar: "https://placehold.co/80x80",
            date: "06-12-2004, 01:45 PM",
            signature: "",
            text: `looking for a flatbed scanner to scan my drawings<br><br>
                   doesn't need to be fancy. just needs to work with xp<br><br>
                   local pickup preferred (alberta) but will consider shipping`
          }
        ]
      }
    ]
  },

  {
    id: "site-feedback",
    name: "Site Feedback",
    description: "Bugs, suggestions, complaints. Be nice about it.",
    threads: [
      {
        id: "avatars-not-loading",
        title: "avatars not loading for anyone else",
        author: "xXShadowKnightXx",
        date: "2004-06-10",
        displayDate: "06-10-2004",
        posts: 4,
        views: 99,
        lastPost: "2004-06-11 09:00",
        type: "thread",
        content: [
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-10-2004, 08:00 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `my avatar keeps showing as a broken image<br><br>
                   i re-uploaded it twice<br><br>
                   is it just me`
          },
          {
            author: "CoolGuy2004",
            userTitle: "Admin",
            joinDate: "Jun 2004",
            postCount: 1,
            location: "The Internet",
            avatar: "https://placehold.co/80x80",
            date: "06-11-2004, 09:00 AM",
            signature: "Windows XP Professional User",
            text: `yeah i know about it<br><br>
                   working on it. clear ur cache in the meantime`
          }
        ]
      },
      {
        id: "theme-suggestion",
        title: "suggestion: dark mode theme option",
        author: "PrairieGhost",
        date: "2004-06-09",
        displayDate: "06-09-2004",
        posts: 6,
        views: 143,
        lastPost: "2004-06-10 11:00",
        type: "thread",
        content: [
          {
            author: "PrairieGhost",
            userTitle: "lurker",
            joinDate: "Jun 2004",
            postCount: 7,
            location: "Saskatchewan",
            avatar: "https://placehold.co/80x80",
            date: "06-09-2004, 09:00 PM",
            signature: "",
            text: `would it be possible to have a dark theme option<br><br>
                   the white background at night is really bright<br><br>
                   my eyes hurt`
          },
          {
            author: "CoolGuy2004",
            userTitle: "Admin",
            joinDate: "Jun 2004",
            postCount: 1,
            location: "The Internet",
            avatar: "https://placehold.co/80x80",
            date: "06-10-2004, 11:00 AM",
            signature: "Windows XP Professional User",
            text: `noted. no promises but i'll look into it<br><br>
                   also try turning down your monitor brightness lol`
          }
        ]
      },
      {
        id: "search-broken",
        title: "search function not working properly",
        author: "GlennFromAccounting",
        date: "2004-06-11",
        displayDate: "06-11-2004",
        posts: 3,
        views: 67,
        lastPost: "2004-06-11 16:00",
        type: "thread",
        content: [
          {
            author: "GlennFromAccounting",
            userTitle: "senior member",
            joinDate: "Apr 2004",
            postCount: 412,
            location: "Manitoba",
            avatar: "https://placehold.co/80x80",
            date: "06-11-2004, 02:00 PM",
            signature: "My other computer is also a Dell",
            text: `searched for "printer" and got no results<br><br>
                   i know there's a thread about printers because i made it<br><br>
                   is search broken`
          },
          {
            author: "CoolGuy2004",
            userTitle: "Admin",
            joinDate: "Jun 2004",
            postCount: 1,
            location: "The Internet",
            avatar: "https://placehold.co/80x80",
            date: "06-11-2004, 04:00 PM",
            signature: "Windows XP Professional User",
            text: `yes search is currently broken<br><br>
                   known issue. working on it<br><br>
                   for now just browse manually`
          }
        ]
      },
      {
        id: "mobile-layout-broken",
        title: "site looks weird on my phone - is that intentional",
        author: "VancouverVince",
        date: "2004-06-12",
        displayDate: "06-12-2004",
        posts: 2,
        views: 28,
        lastPost: "2004-06-12 15:00",
        type: "thread",
        content: [
          {
            author: "VancouverVince",
            userTitle: "new member",
            joinDate: "Jun 2004",
            postCount: 1,
            location: "Vancouver BC",
            avatar: "https://placehold.co/80x80",
            date: "06-12-2004, 02:30 PM",
            signature: "",
            text: `tried to load the forum on my phone and everything is tiny<br><br>
                   is there a mobile version or is this just how it is`
          },
          {
            author: "CoolGuy2004",
            userTitle: "Admin",
            joinDate: "Jun 2004",
            postCount: 1,
            location: "The Internet",
            avatar: "https://placehold.co/80x80",
            date: "06-12-2004, 03:00 PM",
            signature: "Windows XP Professional User",
            text: `lol what phone browses the internet<br><br>
                   use a real computer`
          }
        ]
      },
      {
        id: "report-a-spammer",
        title: "report spammers here",
        author: "CoolGuy2004",
        date: "2004-06-01",
        displayDate: "06-01-2004",
        posts: 2,
        views: 80,
        lastPost: "2004-06-12 12:00",
        type: "thread",
        content: [
          {
            author: "CoolGuy2004",
            userTitle: "Admin",
            joinDate: "Jun 2004",
            postCount: 1,
            location: "The Internet",
            avatar: "https://placehold.co/80x80",
            date: "06-01-2004, 09:30 AM",
            signature: "Windows XP Professional User",
            text: `if you see spam or rule breaking post the username here<br><br>
                   i'll deal with it when i'm online`
          },
          {
            author: "xXShadowKnightXx",
            userTitle: "banned from school computers",
            joinDate: "May 2004",
            postCount: 183,
            location: "unknown",
            avatar: "https://placehold.co/80x80",
            date: "06-12-2004, 12:00 PM",
            signature: "AOL Instant Messenger: shadowknight420",
            text: `reporting myself for that y2k post<br><br>
                   it was off topic and i regret nothing`
          }
        ]
      }
    ]
  }

];
