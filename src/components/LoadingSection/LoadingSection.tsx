import LoadingRing from '../LoadingRing'

interface Props {
  className?: string
}

export default function LoadingSection({ className = 'flex h-96 w-full items-center justify-center' }: Props) {
  return (
    <div className={className}>
      <LoadingRing />
    </div>
  )
}
