# Redesign concept audit

- Concepts: 20
- Captures: 19
- Errors: 31
- Warnings: 6

- **error** `liquid-sigil` / `main-count`: Expected one main, found 0.
- **error** `liquid-sigil` / `h1-count`: Expected one visible h1, found 0.
- **warning** `liquid-sigil` / `theme`: Expected dark, found undefined.
- **error** `liquid-sigil` / `runtime`: pageerror: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <Suspense fallback={<LoadingConcept>}>
      <Concept concept={{index:1,slug:"...", ...}} mode="detail">
        <ConceptRoot concept={{index:1,slug:"...", ...}} preset={{name:"obsid", ...}} compare={false}>
          <SigilTokensProvider initialPreset={{name:"obsid", ...}} styleTagAttr="data-sigil...">
            <ConceptMotionRoot enabled={true}>
              <div ref={{current:null}} data-concept-motion="lenis-gsap">
                <div data-concept="liquid-sigil" className="relative m...">
                  <ConceptChrome concept={{index:1,slug:"...", ...}}>
                    <nav aria-label="Concept re..." className="fixed inse...">
                      <div>
                      <span>
                      <div className="flex items...">
                        <button
                          type="button"
+                         aria-label="Use light mode"
-                         aria-label="Use dark mode"
                          onClick={function onClick}
                          className="grid size-10 place-items-center border-l border-[var(--s-border)] bg-transparent ..."
                        >
                          <Sun aria-hidden={true} className="size-3.5">
                            <svg
                              ref={null}
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
+                             className="lucide lucide-sun size-3.5"
-                             className="lucide lucide-moon size-3.5"
                              aria-hidden={true}
                            >
+                             <circle cx="12" cy="12" r="4">
-                             <path
-                               d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268..."
-                             >
                              ...
                        ...
                  ...

- **error** `liquid-sigil` / `runtime`: pageerror: Cannot read properties of undefined (reading 'length')
- **error** `token-foundry` / `main-count`: Expected one main, found 0.
- **error** `token-foundry` / `h1-count`: Expected one visible h1, found 0.
- **warning** `token-foundry` / `theme`: Expected dark, found undefined.
- **error** `token-foundry` / `runtime`: pageerror: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <Suspense fallback={<LoadingConcept>}>
      <Concept concept={{index:2,slug:"...", ...}} mode="detail">
        <ConceptRoot concept={{index:2,slug:"...", ...}} preset={{name:"alloy", ...}} compare={false}>
          <SigilTokensProvider initialPreset={{name:"alloy", ...}} styleTagAttr="data-sigil...">
            <ConceptMotionRoot enabled={true}>
              <div ref={{current:null}} data-concept-motion="lenis-gsap">
                <div data-concept="token-foundry" className="relative m...">
                  <ConceptChrome concept={{index:2,slug:"...", ...}}>
                    <nav aria-label="Concept re..." className="fixed inse...">
                      <div>
                      <span>
                      <div className="flex items...">
                        <button
                          type="button"
+                         aria-label="Use light mode"
-                         aria-label="Use dark mode"
                          onClick={function onClick}
                          className="grid size-10 place-items-center border-l border-[var(--s-border)] bg-transparent ..."
                        >
                          <Sun aria-hidden={true} className="size-3.5">
                            <svg
                              ref={null}
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
+                             className="lucide lucide-sun size-3.5"
-                             className="lucide lucide-moon size-3.5"
                              aria-hidden={true}
                            >
+                             <circle cx="12" cy="12" r="4">
-                             <path
-                               d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268..."
-                             >
                              ...
                        ...
                  ...

- **error** `token-foundry` / `runtime`: pageerror: Cannot read properties of undefined (reading 'length')
- **error** `token-foundry` / `runtime`: pageerror: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <Suspense fallback={<LoadingConcept>}>
      <Concept concept={{index:2,slug:"...", ...}} mode="detail">
        <ConceptRoot concept={{index:2,slug:"...", ...}} preset={{name:"alloy", ...}} compare={false}>
          <SigilTokensProvider initialPreset={{name:"alloy", ...}} styleTagAttr="data-sigil...">
            <ConceptMotionRoot enabled={true}>
              <div ref={{current:null}} data-concept-motion="lenis-gsap">
                <div data-concept="token-foundry" className="relative m...">
                  <ConceptChrome concept={{index:2,slug:"...", ...}}>
                    <nav aria-label="Concept re..." className="fixed inse...">
                      <div>
                      <span>
                      <div className="flex items...">
                        <button
                          type="button"
+                         aria-label="Use light mode"
-                         aria-label="Use dark mode"
                          onClick={function onClick}
                          className="grid size-10 place-items-center border-l border-[var(--s-border)] bg-transparent ..."
                        >
                          <Sun aria-hidden={true} className="size-3.5">
                            <svg
                              ref={null}
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
+                             className="lucide lucide-sun size-3.5"
-                             className="lucide lucide-moon size-3.5"
                              aria-hidden={true}
                            >
+                             <circle cx="12" cy="12" r="4">
-                             <path
-                               d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268..."
-                             >
                              ...
                        ...
                  ...

- **error** `token-foundry` / `runtime`: pageerror: Cannot read properties of undefined (reading 'length')
- **error** `spec-to-system` / `main-count`: Expected one main, found 0.
- **error** `spec-to-system` / `h1-count`: Expected one visible h1, found 0.
- **warning** `spec-to-system` / `theme`: Expected dark, found undefined.
- **error** `spec-to-system` / `runtime`: pageerror: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <Suspense fallback={<LoadingConcept>}>
      <Concept concept={{index:3,slug:"...", ...}} mode="detail">
        <ConceptRoot concept={{index:3,slug:"...", ...}} preset={{name:"crux", ...}} compare={false}>
          <SigilTokensProvider initialPreset={{name:"crux", ...}} styleTagAttr="data-sigil...">
            <ConceptMotionRoot enabled={true}>
              <div ref={{current:null}} data-concept-motion="lenis-gsap">
                <div data-concept="spec-to-sy..." className="relative m...">
                  <ConceptChrome concept={{index:3,slug:"...", ...}}>
                    <nav aria-label="Concept re..." className="fixed inse...">
                      <div>
                      <span>
                      <div className="flex items...">
                        <button
                          type="button"
+                         aria-label="Use light mode"
-                         aria-label="Use dark mode"
                          onClick={function onClick}
                          className="grid size-10 place-items-center border-l border-[var(--s-border)] bg-transparent ..."
                        >
                          <Sun aria-hidden={true} className="size-3.5">
                            <svg
                              ref={null}
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
+                             className="lucide lucide-sun size-3.5"
-                             className="lucide lucide-moon size-3.5"
                              aria-hidden={true}
                            >
+                             <circle cx="12" cy="12" r="4">
-                             <path
-                               d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268..."
-                             >
                              ...
                        ...
                  ...

- **error** `spec-to-system` / `runtime`: pageerror: Cannot read properties of undefined (reading 'length')
- **error** `token-lathe` / `main-count`: Expected one main, found 0.
- **error** `token-lathe` / `h1-count`: Expected one visible h1, found 0.
- **warning** `token-lathe` / `theme`: Expected dark, found undefined.
- **error** `token-lathe` / `runtime`: pageerror: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <Suspense fallback={<LoadingConcept>}>
      <Concept concept={{index:4,slug:"...", ...}} mode="detail">
        <ConceptRoot concept={{index:4,slug:"...", ...}} preset={{name:"anvil", ...}} compare={false}>
          <SigilTokensProvider initialPreset={{name:"anvil", ...}} styleTagAttr="data-sigil...">
            <ConceptMotionRoot enabled={true}>
              <div ref={{current:null}} data-concept-motion="lenis-gsap">
                <div data-concept="token-lathe" className="relative m...">
                  <ConceptChrome concept={{index:4,slug:"...", ...}}>
                    <nav aria-label="Concept re..." className="fixed inse...">
                      <div>
                      <span>
                      <div className="flex items...">
                        <button
                          type="button"
+                         aria-label="Use light mode"
-                         aria-label="Use dark mode"
                          onClick={function onClick}
                          className="grid size-10 place-items-center border-l border-[var(--s-border)] bg-transparent ..."
                        >
                          <Sun aria-hidden={true} className="size-3.5">
                            <svg
                              ref={null}
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
+                             className="lucide lucide-sun size-3.5"
-                             className="lucide lucide-moon size-3.5"
                              aria-hidden={true}
                            >
+                             <circle cx="12" cy="12" r="4">
-                             <path
-                               d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268..."
-                             >
                              ...
                        ...
                  ...

- **error** `token-lathe` / `runtime`: pageerror: Cannot read properties of undefined (reading 'length')
- **error** `source-result-tear` / `main-count`: Expected one main, found 0.
- **error** `source-result-tear` / `h1-count`: Expected one visible h1, found 0.
- **warning** `source-result-tear` / `theme`: Expected dark, found undefined.
- **error** `source-result-tear` / `runtime`: pageerror: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <Suspense fallback={<LoadingConcept>}>
      <Concept concept={{index:5,slug:"...", ...}} mode="detail">
        <ConceptRoot concept={{index:5,slug:"...", ...}} preset={{name:"sigil", ...}} compare={false}>
          <SigilTokensProvider initialPreset={{name:"sigil", ...}} styleTagAttr="data-sigil...">
            <ConceptMotionRoot enabled={true}>
              <div ref={{current:null}} data-concept-motion="lenis-gsap">
                <div data-concept="source-res..." className="relative m...">
                  <ConceptChrome concept={{index:5,slug:"...", ...}}>
                    <nav aria-label="Concept re..." className="fixed inse...">
                      <div>
                      <span>
                      <div className="flex items...">
                        <button
                          type="button"
+                         aria-label="Use light mode"
-                         aria-label="Use dark mode"
                          onClick={function onClick}
                          className="grid size-10 place-items-center border-l border-[var(--s-border)] bg-transparent ..."
                        >
                          <Sun aria-hidden={true} className="size-3.5">
                            <svg
                              ref={null}
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
+                             className="lucide lucide-sun size-3.5"
-                             className="lucide lucide-moon size-3.5"
                              aria-hidden={true}
                            >
+                             <circle cx="12" cy="12" r="4">
-                             <path
-                               d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268..."
-                             >
                              ...
                        ...
                  ...

- **error** `source-result-tear` / `runtime`: pageerror: Cannot read properties of undefined (reading 'length')
- **error** `monochrome-press` / `main-count`: Expected one main, found 0.
- **error** `monochrome-press` / `h1-count`: Expected one visible h1, found 0.
- **warning** `monochrome-press` / `theme`: Expected dark, found undefined.
- **error** `monochrome-press` / `runtime`: pageerror: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <Suspense fallback={<LoadingConcept>}>
      <Concept concept={{index:6,slug:"...", ...}} mode="detail">
        <ConceptRoot concept={{index:6,slug:"...", ...}} preset={{name:"mono", ...}} compare={false}>
          <SigilTokensProvider initialPreset={{name:"mono", ...}} styleTagAttr="data-sigil...">
            <ConceptMotionRoot enabled={true}>
              <div ref={{current:null}} data-concept-motion="lenis-gsap">
                <div data-concept="monochrome..." className="relative m...">
                  <ConceptChrome concept={{index:6,slug:"...", ...}}>
                    <nav aria-label="Concept re..." className="fixed inse...">
                      <div>
                      <span>
                      <div className="flex items...">
                        <button
                          type="button"
+                         aria-label="Use light mode"
-                         aria-label="Use dark mode"
                          onClick={function onClick}
                          className="grid size-10 place-items-center border-l border-[var(--s-border)] bg-transparent ..."
                        >
                          <Sun aria-hidden={true} className="size-3.5">
                            <svg
                              ref={null}
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
+                             className="lucide lucide-sun size-3.5"
-                             className="lucide lucide-moon size-3.5"
                              aria-hidden={true}
                            >
+                             <circle cx="12" cy="12" r="4">
-                             <path
-                               d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268..."
-                             >
                              ...
                        ...
                  ...

- **error** `monochrome-press` / `runtime`: pageerror: Cannot read properties of undefined (reading 'length')
- **error** `monochrome-press` / `runtime`: pageerror: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <Suspense fallback={<LoadingConcept>}>
      <Concept concept={{index:6,slug:"...", ...}} mode="detail">
        <ConceptRoot concept={{index:6,slug:"...", ...}} preset={{name:"mono", ...}} compare={false}>
          <SigilTokensProvider initialPreset={{name:"mono", ...}} styleTagAttr="data-sigil...">
            <ConceptMotionRoot enabled={true}>
              <div ref={{current:null}} data-concept-motion="lenis-gsap">
                <div data-concept="monochrome..." className="relative m...">
                  <ConceptChrome concept={{index:6,slug:"...", ...}}>
                    <nav aria-label="Concept re..." className="fixed inse...">
                      <div>
                      <span>
                      <div className="flex items...">
                        <button
                          type="button"
+                         aria-label="Use light mode"
-                         aria-label="Use dark mode"
                          onClick={function onClick}
                          className="grid size-10 place-items-center border-l border-[var(--s-border)] bg-transparent ..."
                        >
                          <Sun aria-hidden={true} className="size-3.5">
                            <svg
                              ref={null}
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
+                             className="lucide lucide-sun size-3.5"
-                             className="lucide lucide-moon size-3.5"
                              aria-hidden={true}
                            >
+                             <circle cx="12" cy="12" r="4">
-                             <path
-                               d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268..."
-                             >
                              ...
                        ...
                  ...

- **error** `monochrome-press` / `runtime`: pageerror: Cannot read properties of undefined (reading 'length')
- **error** `oxide-instrument` / `navigation`: locator.waitFor: Timeout 20000ms exceeded.
Call log:
[2m  - waiting for locator('[data-concept]') to be visible[22m

- **error** `chrome-selection-museum` / `runtime`: pageerror: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <Suspense fallback={<LoadingConcept>}>
      <Concept concept={{index:8,slug:"...", ...}} mode="detail">
        <ConceptRoot concept={{index:8,slug:"...", ...}} preset={{name:"brass", ...}} compare={false} className="pt-12">
          <SigilTokensProvider initialPreset={{name:"brass", ...}} styleTagAttr="data-sigil...">
            <ConceptMotionRoot enabled={true}>
              <div ref={{current:null}} data-concept-motion="lenis-gsap">
                <div data-concept="chrome-sel..." className="relative m...">
                  <ConceptChrome concept={{index:8,slug:"...", ...}}>
                    <nav aria-label="Concept re..." className="fixed inse...">
                      <div>
                      <span>
                      <div className="flex items...">
                        <button
                          type="button"
+                         aria-label="Use light mode"
-                         aria-label="Use dark mode"
                          onClick={function onClick}
                          className="grid size-10 place-items-center border-l border-[var(--s-border)] bg-transparent ..."
                        >
                          <Sun aria-hidden={true} className="size-3.5">
                            <svg
                              ref={null}
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
+                             className="lucide lucide-sun size-3.5"
-                             className="lucide lucide-moon size-3.5"
                              aria-hidden={true}
                            >
+                             <circle cx="12" cy="12" r="4">
-                             <path
-                               d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268..."
-                             >
                              ...
                        ...
                  ...

- **error** `chrome-selection-museum` / `runtime`: pageerror: Cannot read properties of undefined (reading 'length')
