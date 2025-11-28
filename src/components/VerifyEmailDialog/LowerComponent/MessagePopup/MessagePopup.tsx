import TransitionPopup from '../TransitionPopup'

interface Props {
  dialog: boolean
  closeDialog: () => void
  children?: React.ReactNode
}

export default function MessagePopup({ dialog, closeDialog, children = <div></div> }: Props) {
  return (
    <TransitionPopup isOpen={dialog} handleClose={closeDialog} classNameWrapper='rounded-2xl shadow-xl'>
      <div
        className='flex max-w-[480px] flex-col items-center justify-between space-y-4 rounded-2xl bg-black 
      px-3 py-4 font-newfont dark:bg-black dark:text-darkText tablet:px-14 tablet:py-5'
      >
        <div className='space-y-4 text-sm tablet:text-base desktop:text-lg'>{children}</div>

        <button
          className={
            ' rounded-2xl bg-unhoveringBg px-6 py-2 text-xl font-medium text-black outline-none hover:bg-hoveringBg tablet:rounded-2xl tablet:px-10 '
          }
          onClick={closeDialog}
        >
          OK
        </button>
      </div>
    </TransitionPopup>
  )
}
