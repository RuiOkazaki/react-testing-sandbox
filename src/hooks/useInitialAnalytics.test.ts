import { renderHook } from "@testing-library/react"

import { useInitialAnalytics } from "~/hooks/useInitialAnalytics"
import * as analyticsModule from "~/libs/analytics"

const spiedSetStatus = jest.spyOn(analyticsModule, "setStatus")
const spiedSendPageview = jest.spyOn(analyticsModule, "sendPageview")

test("useInitialAnalytics 初回実行", () => {
  // Hooksを呼び出すためにrenderHookを使う
  renderHook(() => useInitialAnalytics({ id: "foo", role: "bar" }))
  expect(spiedSetStatus).toBeCalledWith({ id: "foo", role: "bar" })
  expect(spiedSendPageview).toBeCalled()
})
