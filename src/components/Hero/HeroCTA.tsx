import Button from '../Button'

const HeroCTA = () => {
  return (
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <Button
        type="button"
        title="Start Learning Now"
        variant="bg-indigo-600 text-white px-6 py-3 hover:bg-indigo-500 shadow-sm transition-colors"
      />
    </div>
  )
}

export default HeroCTA
