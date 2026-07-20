import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { contactInfo } from '../data/contact'
import { heroImage } from '../data/gallery'
import NewsletterForm from '../components/NewsletterForm'

function Home() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative min-h-[88vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-[center_40%]"
          style={{
            backgroundImage: `url('${heroImage.url}')`,
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[hsl(24,10%,10%/0.15)]" />

        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl items-center px-6 py-20 md:py-28">
          <div className="max-w-xl rounded-sm border border-[hsl(24,10%,88%)] bg-white px-8 py-10 shadow-lg md:max-w-2xl md:px-10 md:py-12">
            <p className="mb-6 text-xs font-semibold tracking-[0.35em] text-[hsl(24,10%,40%)] uppercase">
              Washington, DC · Est. 2010
            </p>
            <h1 className="font-heading text-[clamp(3.25rem,7.5vw,5.5rem)] leading-[1.05] font-semibold tracking-tight text-[hsl(24,10%,10%)]">
              {contactInfo.name}
            </h1>
            <Separator className="my-8 max-w-24 bg-[hsl(24,10%,75%)]" />
            <p className="max-w-lg text-lg leading-relaxed text-[hsl(24,10%,30%)] md:text-xl">
              Bienvenue — step into a salon of French fine dining, where butter, wine,
              and slow craftsmanship meet the joy of a long, unhurried soirée among
              friends.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/menu"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
              >
                View the Menu
              </Link>
              <Link
                to="/reservations"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
              >
                Reserve a Table
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
            Explore
          </p>
          <h2 className="font-heading text-4xl font-light tracking-tight md:text-5xl">
            The World of Café Fausse
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: 'Our Story',
              description:
                'Meet the founders and discover the philosophy behind every service.',
              to: '/about',
              label: 'Learn more',
            },
            {
              title: 'Gallery',
              description:
                'The warm ambiance, artful plates, and details that define our charm.',
              to: '/gallery',
              label: 'View gallery',
            },
            {
              title: 'Reservations',
              description:
                'Reserve your table for an unforgettable evening in our Parisian salon.',
              to: '/reservations',
              label: 'Book now',
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="border-border/60 bg-transparent text-center shadow-none ring-0"
            >
              <CardHeader>
                <CardTitle className="font-heading text-xl font-normal tracking-normal normal-case">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="justify-center">
                <Link
                  to={item.to}
                  className="text-xs font-semibold tracking-[0.2em] text-foreground uppercase transition-colors hover:text-muted-foreground"
                >
                  {item.label} →
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* Newsletter */}
      <section className="mx-auto max-w-2xl px-6 py-12 text-center md:py-16">
        <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
          Newsletter
        </p>
        <h2 className="font-heading mb-4 text-4xl font-light tracking-tight md:text-5xl">
          Stay in the Know
        </h2>
        <p className="mx-auto mb-8 max-w-md text-base leading-relaxed text-muted-foreground">
          Be the first to hear about tasting menus, wine pairings, and
          private evening events.
        </p>
        <Card className="border-border/60">
          <CardContent className="flex justify-center pt-8">
            <NewsletterForm centered />
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default Home
