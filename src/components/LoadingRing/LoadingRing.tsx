import { ColorRing } from 'react-loader-spinner'

interface Props {
  width?: number
  colorCode?: string
}

export default function LoadingRing({ width = 80, colorCode = 'ff8800' }: Props) {
  return (
    <ColorRing
      visible={true}
      height={width}
      width={width}
      ariaLabel='blocks-loading'
      wrapperStyle={{}}
      wrapperClass='blocks-wrapper'
      colors={[`#${colorCode}`, `#${colorCode}`, `#${colorCode}`, `#${colorCode}`, `#${colorCode}`]}
    />
  )
}
