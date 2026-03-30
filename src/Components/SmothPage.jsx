import { ReactLenis } from '@studio-freight/react-lenis'
export default function SmothPage({children}) {
  return (
    <ReactLenis root options={{ easing: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)', duration: 1 }}>
        {children}
    </ReactLenis>
)
}
