import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { GarlicBroccoli } from 'components/garlic'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from 'components/ui/navigation-menu'
import { Car, Code, FileText, LogIn, UserPlus, UsersIcon } from 'lucide-react'

export const Route = createLazyFileRoute('/')({
	component: Index,
})

const className = 'mr-2 h-6 w-4'

const footerNavigationItems = [
	<a href="https://github.com/michaelsnook/sunlo-nextjs">
		<Code className={className} />
		GitHub
	</a>,
	<Link to="/privacy-policy" from="/">
		<FileText className={className} />
		Privacy Policy
	</Link>,
	<Link to="/login" from="/">
		<LogIn className={className} />
		Login
	</Link>,
	<Link to="/signup" from="/">
		<UserPlus className={className} />
		Signup
	</Link>,
]

function Index() {
	return (
		<>
			<main className="mb-8 flex flex-row flex-wrap gap-4 @xl:my-20">
				<div className="mx-auto flex max-w-[537px] basis-11/12 flex-col justify-center space-y-4 @xl:basis-3/5">
					<h1 className="d2 mt-12 text-center @xl:mb-4 @xl:mt-8 @xl:text-start md:mb-10">
						Sunlo: social language&nbsp;learning
					</h1>
					<p className="text-center text-xl @xl:h-[120px] @xl:text-start">
						Create your own flash cards, pick from a crowd-sourced pool, or send
						your friend some key phrases to help them learn.
					</p>
				</div>
				<div className="mx-auto flex-none space-y-4 text-center @xl:basis-1/3">
					<GarlicBroccoli className="mx-auto" />
					<Button asChild size="lg" variant="white">
						<Link to="/login" from="/">
							Log in or sign up &rarr;
						</Link>
					</Button>
				</div>
			</main>

			<div className="w-app card bg-black/30 text-center border-accent text-accent">
				⚠️ Sunlo is under development; it is incomplete but most of what&apos;s
				here should work, so if you do spot a problem, please let me know! ⚠️
			</div>
			<section className="my-16 bg-base-100 px-1 pb-8 pt-4 text-base-content @lg:px-4 @lg:pb-16 @lg:pt-10">
				<h2 className="h2 px-4 text-center @lg:mb-6">
					Our Approach to Language&nbsp;Learning
				</h2>
				<div className="flex gap-4 flex-row flex-wrap">
					<Card className="basis-80 flex-grow">
						<CardHeader>
							<CardTitle className="flex-row gap-2 flex">
								<PhraseIcon /> Phrase Based
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<p>
								Sunlo&apos;s approach is phrases-first, useful for people who
								are immersed in a new language context and want to learn for
								immediate use – how to ask for directions or order tea or swear
								at your friends.
							</p>
							<p>
								We think this is effective, and motivating – and it means you
								can choose the areas you focus on to suit your goals.
							</p>
						</CardContent>
					</Card>
					<Card className="basis-80 flex-grow">
						<CardHeader>
							<CardTitle className="flex-row gap-2 flex">
								<UsersIcon /> Social Learning
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<p>
								We don&apos;t learn languages to earn gems or score points – we
								learn to connect with people.
							</p>
							<p>
								When you move to a new city, take a new job, or want to learn
								the language of your extended family, you will always find
								people who want to help, which is why Sunlo has a special
								&ldquo;Friend Mode&rdquo; so your new friends can send you all
								their favourite phrases and help you along your journey.
							</p>
						</CardContent>
					</Card>
					<Card className="basis-80 flex-grow">
						<CardHeader>
							<CardTitle className="flex-row gap-2 flex">
								<CuriosityIcon /> Driven by Curiosity
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<p>
								Often times, trying to translate literally from one language to
								another doesn&apos;t really work, but if you spend enough time
								clicking around you will start to catch on to the patterns.
							</p>
							<p>
								Sunlo is meant to feed your curiosity and reward it, because
								that feeling of wonder and excitement keeps your brain in its
								best learning space.
							</p>
						</CardContent>
					</Card>
				</div>
			</section>
			<section className="my-16 pb-16 pt-4 @lg:pt-10">
				<h2 className="h2 px-4 pb-6 text-center">Who is Sunlo for?</h2>
				<div className="flex justify-center gap-4 flex-row flex-wrap">
					<Card className="basis-80 flex-grow">
						<CardHeader>
							<CardTitle className="flex-row gap-2 flex">
								<PlaneIcon /> Moving To a New Place
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<p>
								If you just moved to a new place, and you&apos;re surrounded by
								people speaking another language, Sunlo is for you.
							</p>
							<p>
								Our approach works best when you have daily opportunities to
								deploy your new skills and build on them – and when you have
								friends, family or colleagues who are excited to help you learn.
							</p>
						</CardContent>
					</Card>
					<Card className="basis-80 flex-grow">
						<CardHeader>
							<CardTitle className="flex-row gap-2 flex">
								<FriendIcon /> The Friend / Guide
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<p>
								If you&apos;re the one helping a friend or colleague learn{' '}
								<em>your</em> language, Sunlo&apos;s &ldquo;Friend Mode&rdquo;
								is for you! Teach them the lyrics to a favourite song, or how to
								order at lunch for the table.
							</p>
							<p>
								You can pick from our public pool of flash cards, or create new
								ones that will help the whole community too.
							</p>
						</CardContent>
					</Card>

					<Card className="basis-80 flex-grow">
						<CardHeader>
							<CardTitle className="flex-row gap-2 flex">
								<HeartIcon /> Extended Family
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<p>
								Some people grow up speaking different languages than the rest
								of their family, especially in the case of the linguistic
								&ldquo;generation gap.&rdquo; Perhaps your grandparents speak a
								more regional language and it can be difficult to find resources
								or even apps that can help.
							</p>
							<p>
								Sunlo relies on user-generated content, so you can ask your
								parents or your fun cousin and get started; no barriers will
								stand in your way.
							</p>
						</CardContent>
					</Card>
				</div>
			</section>
			<section className="my-10 pb-16 text-center">
				<h2 className="h2">Ready to get started?</h2>
				<Button asChild size="lg" variant="white">
					<Link to="/login" from="/" className="w-80">
						Sign up and start learning &rarr;
					</Link>
				</Button>
			</section>

			<section className="my-16 px-2 pb-16 pt-4 @lg:px-8 @lg:pt-10">
				<Card className="p-[4%]">
					<CardHeader>
						<CardTitle className="h2 px-4 pb-6 text-center">
							The Story Behind Sunlo
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="columns-1 space-y-4 text-xl/8 @lg:columns-2">
							<p>
								Sunlo is a labour of love that started in 2015 when I came to
								India and found tools like the owl app lacking. (You know the
								one...)
							</p>
							<p>
								I found I didn&apos;t need to know the word for
								&ldquo;Tomato&rdquo; as much as I needed to be able to point at
								the tomato and say &ldquo;give me 6 of those (polite).&rdquo;
								When I learned to do this, the rest started to fall into place.
							</p>
							<p>
								As I tried other methods and researched the science of
								language-learning I started to feel a lack of good tools for
								helping people learn languages that are{' '}
								<em>different in structure</em> from the ones they&apos;re
								raised on. Learning{' '}
								<span className="underline decoration-accent decoration-[3px] dark:decoration-warning">
									Spanish
								</span>{' '}
								from{' '}
								<span className="underline decoration-accent decoration-[3px] dark:decoration-warning">
									English
								</span>{' '}
								may be straight-forward with lessons on vocabulary and grammar,
								but the same approach might not work to learn{' '}
								<span className="underline decoration-accent decoration-[3px] dark:decoration-warning">
									Arabic
								</span>
								,{' '}
								<span className="underline decoration-accent decoration-[3px] dark:decoration-warning">
									Xhosa
								</span>{' '}
								or{' '}
								<span className="underline decoration-accent decoration-[3px] dark:decoration-warning">
									Mandarin
								</span>
								, whose grammars and patterns may be too unfamiliar for me to
								succeed with that formulaic approach.
							</p>
							<p>
								The answer to this problem seems to be a phrase-based approach,
								where you don&apos;t necessarily try to understand every meaning
								and tense, you learn <em>chunks of meaning</em> that you can use
								in real life. And when you do, it creates a reward in your brain
								and helps you connect with others in your world, both of which
								aid in the formation of lasting, usable memory.
							</p>
							<p>
								There&apos;s a fantastic (and free) app called Anki – which I
								also use and love! – which takes this phrase-based approach, and{' '}
								<a
									className="s-link"
									href="https://docs.ankiweb.net/background.html"
								>
									their background doc
								</a>{' '}
								does a great job of explaining why it&apos;s so effective.{' '}
							</p>
							<p>
								But the most important part of my learning journey was the
								friends I made who were excited to help me. There are a couple
								of friends who have an intuitive sense of how much I know and
								don&apos;t know, and are able to speak to me in a way that they
								know I&apos;ll understand enough of what they&apos;re saying
								that I can learn and figure out the rest.
							</p>
							<p>
								So Sunlo is a bit of a love song to those friends – the very
								reason we learn in the first place – to make them main
								characters in the play as well. It invites them to help curate
								your deck of flash cards and find or create the ones they think
								you&apos;ll need and use and love. If you&apos;re a friend
								helping a newcomer learn your language – Sunlo is for you too.
								Thank you, and welcome! I hope you love it.
							</p>
							<p className="text-center italic">– M</p>
						</div>
					</CardContent>
				</Card>
			</section>
			<section className="my-16 pb-16 pt-4 @lg:pt-10">
				<h2 className="h2 px-4 pb-6 text-center">
					Sunlo is Free and Open Source
				</h2>
				<div className="columns-1 space-y-4 text-xl/8 @lg:columns-2 @xl:columns-3">
					<p>
						For now Sunlo is just me, trying to learn languages to connect with
						the people I love. It is my humble wish that it may help others do
						the same 🙏
					</p>
					<p>
						If you have feedback or suggestions or requests, please do get in
						touch. Sunlo can&apos;t be everything to everyone, but it can always
						get better! ❤️
					</p>
					<p>
						If you&apos;re a developer or a language expert and would like to
						help,{' '}
						<a
							className="s-link"
							href="https://github.com/michaelsnook/sunlo-nextjs"
						>
							check out the code on GitHub
						</a>{' '}
						or find me on socials (
						<a className="s-link" href="https://twitter.com/michaelsnook">
							tw
						</a>{' '}
						&amp;{' '}
						<a
							className="s-link"
							href="https://bsky.app/profile/michaelsnook.com"
						>
							bsky
						</a>
						).
					</p>
				</div>
			</section>
			<footer className="flex justify-center">
				<NavigationMenu aria-label="Footer Navigation">
					<NavigationMenuList className="my-16 flex flex-row flex-wrap justify-center gap-8 pb-16 pt-4 @lg:pt-10">
						<>
							{footerNavigationItems.map((item, i) => (
								<NavigationMenuItem key={`nav-link-${i}`}>
									<Button variant="ghost" className="text-white/80" asChild>
										{item}
									</Button>
								</NavigationMenuItem>
							))}
						</>
					</NavigationMenuList>
				</NavigationMenu>
			</footer>
		</>
	)
}

const PhraseIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="size-6"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
		/>
	</svg>
)

const CuriosityIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="size-6"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
		/>
	</svg>
)

const PlaneIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="size-6"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
		/>
	</svg>
)

const HeartIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="size-6"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
		/>
	</svg>
)

const FriendIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="size-6"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
		/>
	</svg>
)
