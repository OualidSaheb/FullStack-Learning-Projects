import { ilocale } from './settings'

export function formatTimeWithLocale(time: number, locale: string = ilocale): string {
  // convertir le temps en heures, minutes et secondes
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time - hours * 3600) / 60)
  const seconds = time - hours * 3600 - minutes * 60

  const formatter = new Intl.NumberFormat(locale, {
    minimumIntegerDigits: 2 // rajouter 0 quand juste 1
  })

  const formattedMinutes = formatter.format(minutes)
  const formattedSeconds = formatter.format(seconds)

  if (hours > 0) {
    const formattedHours = formatter.format(hours)
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
  } else {
    return `${formattedMinutes}:${formattedSeconds}`
  }
}

export function formatDate(dateStr: string, locale: string = ilocale): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(
    date
  )
}

export const generateExamCode = (): string => {
  const prefix = 'C'
  const codeNumber = Math.floor(Math.random() * 999) + 1
  const suffix = 'E' + Math.floor(Math.random() * 9) + 1
  return `${prefix}${String(codeNumber).padStart(3, '0')}-${suffix}`
}
