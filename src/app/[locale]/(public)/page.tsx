import dishApiRequest from '@/apiRequests/dish'
import { formatCurrency, generateSlugUrl } from '@/lib/utils'
import { DishListResType } from '@/schemaValidations/dish.schema'
import { CategoryListResType } from '@/schemaValidations/category.schema'
import Image from 'next/image'
import { Link } from '@/navigation'
import { getTranslations } from 'next-intl/server'
import { unstable_setRequestLocale } from 'next-intl/server'
import envConfig, { Locale } from '@/config'
import { htmlToTextForDescription } from '@/lib/server-utils'

// Function to ensure image URL is absolute
const getImageUrl = (imagePath: string) => {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  // Add your image base URL here, for example:
  return `${envConfig.NEXT_PUBLIC_URL}/images/${imagePath}`
}

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: Locale }
}) {
  const t = await getTranslations({ locale, namespace: 'HomePage' })
  const url = envConfig.NEXT_PUBLIC_URL + `/${locale}`

  return {
    title: t('title'),
    description: htmlToTextForDescription(t('description')),
    alternates: {
      canonical: url
    }
  }
}

export default async function Home({
  params: { locale }
}: {
  params: { locale: string }
}) {
  unstable_setRequestLocale(locale)
  const t = await getTranslations('HomePage')
  let dishList: DishListResType['data'] = []
  let categories: CategoryListResType['data'] = []
  try {
    const [dishResult, categoryResult] = await Promise.all([
      dishApiRequest.list(),
      dishApiRequest.listByCategory()
    ])
    dishList = dishResult.payload.data
    categories = categoryResult.payload.data
  } catch (error) {
    return <div>Something went wrong</div>
  }
  return (
    <div className='w-full space-y-4'>
      <section className='relative z-10'>
        <span className='absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10'></span>
        <Image
          src='/banner.png'
          width={400}
          height={200}
          quality={80}
          loading='lazy'
          alt='Banner'
          className='absolute top-0 left-0 w-full h-full object-cover'
        />
        <div className='z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20'>
          <h1 className='text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold'>
            {t('title')}
          </h1>
          <p className='text-center text-sm sm:text-base mt-4'>{t('slogan')}</p>
        </div>
      </section>
      <section className='space-y-10 py-16'>
        <h2 className='text-center text-2xl font-bold'>{t('h2')}</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
          {dishList.map((dish) => (
            <Link
              href={`/dishes/${generateSlugUrl({
                name: dish.name,
                id: dish.id
              })}`}
              className='flex gap-4 w'
              key={dish.id}
            >
              <div className='flex-shrink-0'>
                <Image
                  src={getImageUrl(dish.image)}
                  width={150}
                  height={150}
                  quality={80}
                  loading='lazy'
                  alt={dish.name}
                  className='object-cover w-[150px] h-[150px] rounded-md'
                />
              </div>
              <div className='space-y-1'>
                <h3 className='text-xl font-semibold'>{dish.name}</h3>
                <p className=''>{dish.description}</p>
                <p className='font-semibold'>{formatCurrency(dish.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className='space-y-10 py-16 '>
        <h2 className='text-center text-2xl font-bold'>Menu by Category</h2>
        {categories.map((category) => (
          <div key={category.id} className='space-y-6 max-w-7xl mx-auto px-4'>
            <h3 className='text-xl font-semibold'>{category.name}</h3>
            <p className='text-gray-600'>{category.description}</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
              {category.dishes.map((dish) => (
                <Link
                  href={`/dishes/${generateSlugUrl({
                    name: dish.name,
                    id: dish.id
                  })}`}
                  className='flex gap-4 w'
                  key={dish.id}
                >
                  <div className='flex-shrink-0'>
                    <Image
                      src={getImageUrl(dish.image)}
                      width={150}
                      height={150}
                      quality={80}
                      loading='lazy'
                      alt={dish.name}
                      className='object-cover w-[150px] h-[150px] rounded-md'
                    />
                  </div>
                  <div className='space-y-1'>
                    <h3 className='text-xl font-semibold'>{dish.name}</h3>
                    <p className=''>{dish.description}</p>
                    <p className='font-semibold'>{formatCurrency(dish.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
