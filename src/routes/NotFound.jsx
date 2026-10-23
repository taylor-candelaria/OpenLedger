import { PageHeader } from '@/components/layout/Page.jsx'
import { ArrowLink } from '@/components/ui/Button.jsx'
import { Container } from '@/components/ui/Surfaces.jsx'

export default function NotFound() {
  return (
    <>
      <PageHeader eyebrow="404" title="That page isn’t on the ledger." lede="The link may be out of date, or the address mistyped." />
      <Container>
        <ArrowLink to="/">Go to the home page</ArrowLink>
      </Container>
    </>
  )
}
