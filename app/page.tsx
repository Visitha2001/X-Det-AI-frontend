import ProtectedComponent from "@/components/test_Token"

const page = () => {
  return (
    <div>
      <h1>X-Det-AI</h1>
      <ProtectedComponent />
    </div>
  )
}

export default page