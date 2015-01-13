/* Copyright 2015 Bloomberg Finance L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(["widgets/js/manager", "d3", "./Scale", "./ColorUtils"], function(WidgetManager, d3, ScaleView, ColorUtils) {
    var BaseScaleView = ScaleView[0];
    var LinearColorScale = BaseScaleView.extend({
        render: function(){
            this.scale = d3.scale.linear();
            if(this.model.domain.length > 0) {
                this.scale.domain(this.model.domain);
            }
            this.offset = 0;
            this.ticks = this.model.ticks;
            this.scheme = this.model.scheme = this.model.get("scheme");

            if(this.model.get("colors").length === 0) {
               this.divergent = this.model.divergent = ColorUtils.is_divergent(this.scheme);
            } else {
                this.divergent = this.model.divergent = (this.model.get("colors").length > 2);
            }

            this.model.on("domain_changed", this.model_domain_changed, this);
            this.model.on_some_change(["colors", "scheme"], this.colors_changed, this);
        },
        set_range: function() {
            if(this.model.get("colors").length > 0) {
                var colors = this.model.get("colors");
                if(this.divergent) {
                    this.scale.range([colors[0], colors[1], colors[2]]);
                } else {
                    this.scale.range([colors[0], colors[1]]);
                }
            } else {
                this.scale.range(ColorUtils.get_linear_scale_range(this.model.get("scheme")));
            }

            //This is to handle the case where it changed from 3 element colors
            //to 2 element or vice-versa
            this.model.update_domain();
        },
        colors_changed: function() {
            if(this.model.get("colors").length === 0) {
                this.divergent = this.model.divergent = ColorUtils.is_divergent(this.model.get("scheme"));
            } else {
                this.divergent = this.model.divergent = (this.model.get("colors").length > 2);
            }
            this.set_range();
            this.trigger("color_scale_range_changed");
        },
     });
    WidgetManager.WidgetManager.register_widget_view("LinearColorScale", LinearColorScale);
    return [LinearColorScale];
});
